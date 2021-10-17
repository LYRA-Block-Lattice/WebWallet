import { put, takeLatest, takeEvery, getContext } from "redux-saga/effects";
import { push } from "connected-react-router";
import LyraCrypto from "lyra-crypto";
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";

import * as actionTypes from "./actionTypes";
import persist from "../../lyra/persist";
import * as Dex from "../../lyra/dexapi";

import {
  JsonRpcWebsocket,
  WebsocketReadyStates,
} from "jsonrpc-client-websocket";

let ws;
let network;
let accountId;
let dispatch;

function* checkWalletExists() {
  const data = yield persist.checkData();
  yield put({ type: actionTypes.STORE_INIT_DONE, payload: data });
}

function* createWallet(action) {
  debugger;
  var w = LyraCrypto.GenerateWallet();
  var encData = AES.encrypt(w.privateKey, action.payload.password);

  var wds = {
    pref: {
      network: "testnet",
    },
    wallets: [
      {
        name: action.payload.name,
        accountId: w.accountId,
        data: encData.toString(),
      },
    ],
  };

  yield persist.setData(wds);
  yield put({ type: actionTypes.WALLET_CREATE_DONE });
  yield put(push("/wallet/open"));
}

function* restoreWallet(action) {
  var actId = LyraCrypto.GetAccountIdFromPrivateKey(action.payload.privateKey);
  var encData = AES.encrypt(action.payload.privateKey, action.payload.password);

  var wds = {
    pref: {
      network: "testnet",
    },
    wallets: [
      {
        name: action.payload.name,
        accountId: actId,
        data: encData.toString(),
      },
    ],
  };

  yield persist.setData(wds);
  yield put({ type: actionTypes.WALLET_RESTORE_DONE });

  yield put(push("/wallet/open"));
}

function* removeWallet(action) {
  yield persist.removeData();
  yield put({ type: actionTypes.WALLET_REMOVE_DONE });
}

function* openWallet(action) {
  try {
    var pdata = yield persist.checkData();
    var wallets = pdata.wallets;
    var decData = AES.decrypt(wallets[0].data, action.payload.password);
    if (decData === undefined) throw new Error("private key is invalid.");

    const prvKey = decData.toString(CryptoJS.enc.Utf8);

    if (!LyraCrypto.isPrivateKeyValid(prvKey)) {
      throw new Error("private key is invalid.");
    } else {
      yield put({ type: actionTypes.WALLET_OPEN_DONE, payload: pdata });
      yield put({
        type: actionTypes.WSRPC_CREATE,
        payload: {
          network: pdata.pref.network,
          accountId: wallets[0].accountId,
        },
      });
      sessionStorage.setItem(
        "token",
        JSON.stringify({ pass: action.payload.password, pvt: prvKey })
      );

      yield put(push("/wallet"));
    }
  } catch (err) {
    yield put({ type: actionTypes.WALLET_OPEN_FAILED, payload: err });
  }
}

function* closeWallet() {
  console.log("closing wallet");
  sessionStorage.setItem("token", null);
  yield ws.close();
  ws = null;
  yield put({ type: actionTypes.WALLET_CLOSED });
  yield put(push("/"));
}

function* receive(action) {
  try {
    if (ws.state === WebsocketReadyStates.CLOSED) {
      yield ws.open();
    }
    const balanceResp = yield ws.call("Receive", [accountId]);
    yield put({
      type: actionTypes.WALLET_BALANCE,
      payload: balanceResp.result,
    });
    yield put({
      type: actionTypes.WSRPC_CALL_SUCCESS,
      payload: { tag: action.payload.tag },
    });
  } catch (error) {
    yield put({
      type: actionTypes.WSRPC_CALL_FAILED,
      payload: {
        error: error,
        tag: action.payload.tag,
      },
    });
  }
}

function* send(action) {
  try {
    if (ws.state === WebsocketReadyStates.CLOSED) {
      yield ws.open();
    }
    const balanceResp = yield ws.call("Send", [
      accountId,
      action.payload.amount,
      action.payload.destaddr,
      action.payload.tokenname,
    ]);
    yield put({
      type: actionTypes.WALLET_BALANCE,
      payload: balanceResp.result,
    });
    yield put({
      type: actionTypes.WSRPC_CALL_SUCCESS,
      payload: { tag: action.payload.tag },
    });
  } catch (error) {
    yield put({
      type: actionTypes.WSRPC_CALL_FAILED,
      payload: {
        error: error,
        tag: action.payload.tag,
      },
    });
  }
}

function* createWS() {
  console.log("creating ws for", network);
  var url = "wss://testnet.lyra.live/api/v1/socket";
  if (network === "mainnet") url = "wss://mainnet.lyra.live/api/v1/socket";
  if (network === "devnet") url = "wss://localhost:4504/api/v1/socket";

  const requestTimeoutMs = 10000;

  ws = new JsonRpcWebsocket(url, requestTimeoutMs, (error) => {
    console.log("websocket error", error);
    // reconnect
    dispatch({ type: actionTypes.WSRPC_CLOSED, payload: error });
  });

  try {
    yield ws.open();
  } catch (error) {
    console.log("error ws.open");
  }

  if (ws === null)
    // race condition
    return;

  ws.on("Notify", (news) => {
    switch (news.catalog) {
      case "Receiving":
        dispatch({
          type: actionTypes.WSRPC_SERVER_NOTIFY_RECV,
          payload: news.content,
        });
        break;
      case "Settlement":
        dispatch({
          type: actionTypes.WSRPC_SERVER_NOTIFY_SETTLEMENT,
          payload: news.content,
        });
        break;
      default:
        break;
    }
    console.log("Got news notify", news);
  });

  ws.on("Sign", (hash, msg, accountId) => {
    console.log("Signing " + hash + " of " + msg + " for " + accountId);

    try {
      const userToken = JSON.parse(sessionStorage.getItem("token"));
      var signt = LyraCrypto.Sign(msg, userToken.pvt);
      console.log("Signature", signt);

      return ["der", signt];
    } catch (err) {
      console.log("Error sign message", err);
      return ["err", err.toString()];
    }
  });

  try {
    const response = yield ws.call("Status", ["2.2.0.0", network]);
    yield put({ type: actionTypes.WSRPC_STATUS_SUCCESS, payload: response });

    yield ws.call("Monitor", [accountId]);

    // and balance
    const balanceResp = yield ws.call("Balance", [accountId]);
    yield put({
      type: actionTypes.WALLET_BALANCE,
      payload: balanceResp.result,
    });
  } catch (error) {
    yield put({ type: actionTypes.WSRPC_STATUS_FAILED, payload: error });
  }

  yield put({ type: actionTypes.WSRPC_CREATED });
}

function* wsrpc(action) {
  network = action.payload.network;
  accountId = action.payload.accountId;
  dispatch = yield getContext("dispatch");

  yield createWS();
}

function* savePref(action) {
  var pdata = yield persist.getData();
  pdata.pref.network = action.payload.network;
  yield persist.setData(pdata);

  // need reconnect to api
  yield ws.close();
  network = pdata.pref.network;
  yield createWS();
}

function* dexSignIn(action) {
  try {
    const { data } = yield Dex.signIn(action.payload);

    yield put({ type: actionTypes.DEX_SIGNIN_OK, payload: data });

    yield put(push("/swap"));
  } catch (error) {
    console.log(error);
    yield put({
      type: actionTypes.DEX_ERROR,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
}

function* dexSignUp(action) {
  try {
    // yield put({ type: actionTypes.DEX_ERROR, payload: "something wrong!!!" });
    // return;

    const { data } = yield Dex.signUp(action.payload);

    yield put({ type: actionTypes.DEX_SIGNUP_OK, payload: data });

    yield put(push("/swap"));
  } catch (error) {
    console.log(error);
    yield put({
      type: actionTypes.DEX_ERROR,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
}

export default function* rootSaga() {
  console.log("rootSaga is running.");
  yield takeLatest(actionTypes.STORE_INIT, checkWalletExists);
  yield takeEvery(actionTypes.WALLET_CREATE, createWallet);
  yield takeEvery(actionTypes.WALLET_RESTORE, restoreWallet);
  yield takeEvery(actionTypes.WALLET_REMOVE, removeWallet);
  yield takeEvery(actionTypes.WALLET_OPEN, openWallet);
  yield takeEvery(actionTypes.WALLET_CLOSE, closeWallet);
  yield takeEvery(actionTypes.WSRPC_CREATE, wsrpc);
  yield takeEvery(actionTypes.WSRPC_CLOSED, createWS);
  yield takeEvery(actionTypes.WALLET_RECEIVE, receive);
  yield takeEvery(actionTypes.WALLET_SEND, send);
  yield takeEvery(actionTypes.WALLET_CHANGE_NETWORK, savePref);

  // DeX
  yield takeEvery(actionTypes.DEX_SIGNIN, dexSignIn);
  yield takeEvery(actionTypes.DEX_SIGNUP, dexSignUp);
}
