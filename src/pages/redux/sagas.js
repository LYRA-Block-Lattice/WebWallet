import { put, takeLatest, takeEvery, all } from 'redux-saga/effects'

import * as actionTypes from './actionTypes';
import persist from '../../lyra/persist';
import LyraCrypto from '../../lyra/crypto';
import JsonRpcClient from '../../lyra/jsonrpcclient';

let ws;

function* checkWalletExists () {
    const data = yield persist.checkData();
    yield put({type: actionTypes.STORE_INIT_DONE, payload: data});
}

function* restoreWallet (action) {
    var pvt = LyraCrypto.lyraDec(action.payload.privateKey);
    var actId = LyraCrypto.lyraEncPub(LyraCrypto.prvToPub(pvt));
    var encData = LyraCrypto.encrypt(action.payload.privateKey, action.payload.password);

    var wds = { network: 'testnet', wallets: [{ 
        name: action.payload.name, 
        accountId: actId, 
        data: encData
    }]};

    yield persist.setData(wds);
    yield put({type: actionTypes.WALLET_RESTORE_DONE});
}

function* removeWallet (action) {
    yield persist.removeData();
    yield put({type: actionTypes.WALLET_REMOVE_DONE});
}

function* openWallet(action) {
    var pdata = yield persist.checkData();
    var wallets = pdata.wallets;
    var decData = LyraCrypto.decrypt(wallets[0].data, action.payload.password);
    var pvk = LyraCrypto.lyraDec(decData);

    if(pvk === undefined) {
        yield put({type: actionTypes.WALLET_OPEN_FAILED});
    }
    else {
        yield put({type: actionTypes.WALLET_OPEN_DONE, payload: pdata});
    }   
}

function* wscallback(resp) {
    if (resp.method === "Sign") {
        yield put({type: actionTypes.WSRPC_SERVER_SIGNREQ});
        console.log("Signing " + resp.params[0] + " of " + resp.params[1]);

        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        var pdata = persist.getData();
        var wallets = pdata.wallets;
        var decData = LyraCrypto.decrypt(wallets[0].data, userToken);
        var pvk = LyraCrypto.lyraDec(decData);

        var signt = LyraCrypto.lyraSign(resp.params[1], pvk);
        return ["der", signt];
    }
    else {
        console.log("unsupported server call back method: " + resp.method);
        return null;
    }
}

function* wsonmessage(event) {
    console.log(`[message] Data received from server: ${event.data}`);
    yield put({type: actionTypes.WSRPC_MESSAGE});
    var result = JSON.parse(event.data);
    if (result.method === "Notify") {
        var news = result.params[0];
        console.log("WS Notify: " + news.catalog)
        if (news.catalog === "Receiving") {
            this.setState({ unrecvlyr: this.state.unrecvlyr + news.content.funds.LYR });
            this.setState({ unrecv: this.state.unrecv + 1 });
            this.updurcv();
        }
    }
}

function* wsonopen(event) {
    console.log(new Date().toUTCString() + ' wss open.');

    yield put({ type: actionTypes.WSRPC_CONNECTED });

    this.ws.call('Monitor', [this.state.accountId]);
    this.ws.call('Balance', [this.state.accountId], (resp) => this.lapp.updbal(resp), this.error_cb);
    console.log("wss created.");
}

function* wsonclose() {
    console.log("wss close.");
    yield put({ type: actionTypes.WSRPC_CLOSED });
    // lol force reopen
    this.ws.call('Status', ['2.2.0.0', 'devnet'], this.success_cb, this.error_cb);
}

function* wsonerror(err) {
    console.log("wss error.", err);
    yield put({ type: actionTypes.WSRPC_ERROR, payload: err });
}

function* wsrpc (network) {
    var url = 'wss://testnet.lyra.live/api/v1/socket';
    if(network === 'mainnet')
      url = 'wss://mainnet.lyra.live/api/v1/socket';
    if(network === 'devnet')
      url = 'wss://localhost:4504/api/v1/socket';

    if(ws !== undefined) {
        ws.close();
    }

    ws = new JsonRpcClient({
      socketUrl: url,
      oncallback: wscallback,
      onmessage: wsonmessage,
      onopen: wsonopen,
      onclose: wsonclose,
      onerror: wsonerror
    });

    yield put({ type: actionTypes.WSRPC_CREATED });
}


export default function* rootSaga() {
    console.log('rootSaga is running.');
    yield takeLatest(actionTypes.STORE_INIT, checkWalletExists);
    yield takeEvery(actionTypes.WALLET_RESTORE, restoreWallet);
    yield takeEvery(actionTypes.WALLET_REMOVE, removeWallet);
    yield takeEvery(actionTypes.WALLET_OPEN, openWallet);
    yield takeEvery(actionTypes.WSRPC_CREATE, wsrpc);
}

