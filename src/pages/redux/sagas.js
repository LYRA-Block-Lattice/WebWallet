import { put, takeLatest, takeEvery, getContext } from 'redux-saga/effects'

import * as actionTypes from './actionTypes';
import persist from '../../lyra/persist';
import LyraCrypto from '../../lyra/crypto';

import { JsonRpcWebsocket, WebsocketReadyStates } from '../../wsclient';

let ws;
let network;
let accountId;
let dispatch;

function* checkWalletExists () {
    const data = yield persist.checkData();
    yield put({type: actionTypes.STORE_INIT_DONE, payload: data});
}

function* restoreWallet (action) {
    var pvt = LyraCrypto.lyraDec(action.payload.privateKey);
    var actId = LyraCrypto.lyraEncPub(LyraCrypto.prvToPub(pvt));
    var encData = LyraCrypto.encrypt(action.payload.privateKey, action.payload.password);

    var wds = { 
        pref: {
            network: 'testnet'
        },
        wallets: [{ 
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
    var pvt = LyraCrypto.lyraEncPvt(pvk);

    if(pvk === undefined) {
        yield put({type: actionTypes.WALLET_OPEN_FAILED});
    }
    else {
        yield put({type: actionTypes.WALLET_OPEN_DONE, payload: pdata});
        yield put({type: actionTypes.WSRPC_CREATE, payload: {
            network: pdata.pref.network,
            accountId: wallets[0].accountId
        } });
        sessionStorage.setItem('token', JSON.stringify({pass: action.payload.password, pvt: pvt}));
    }   
}

function* receive(action) {
    try
    {
        if(ws.state === WebsocketReadyStates.CLOSED) {
            yield ws.open();
        }   
        const balanceResp = yield ws.call('Receive', [accountId]); 
        yield put({type: actionTypes.WALLET_BALANCE, payload: balanceResp.result}); 
    }    
    catch(error) {
        yield put({type: actionTypes.WSRPC_CALL_FAILED, payload: error});
    };
}

function* createWS(network) {
    console.log("creating ws for", network);
    var url = 'wss://testnet.lyra.live/api/v1/socket';
    if(network === 'mainnet')
      url = 'wss://mainnet.lyra.live/api/v1/socket';
    if(network === 'devnet')
      url = 'wss://localhost:4504/api/v1/socket';

    const requestTimeoutMs = 10000;
    ws = new JsonRpcWebsocket(
        url,
        requestTimeoutMs,
        (error) => { console.log("websocket error", error) });

        try{
            yield ws.open();
        }
        catch(error) {
            console.log("error ws.open");
        }    
    
        ws.on('Notify', (news) => {
            switch(news.catalog) {
                case 'Receiving': 
                    dispatch({type: actionTypes.WSRPC_SERVER_NOTIFY_RECV, payload: news.content });
                    break;
                default:
                    break;
            }
            console.log("Got news notify", news);
        });
    
        ws.on('Sign', (hash, msg, accountId) => {
            console.log("Signing " + hash + " of " + msg + " for " + accountId);
        
            try {
                const userToken = JSON.parse(sessionStorage.getItem('token'));
                var pvk = LyraCrypto.lyraDec(userToken.pvt);
                var signt = LyraCrypto.lyraSign(msg, pvk);
                console.log("Signature", signt);

                return ["der", signt];
            }
            catch (err) {
                console.log("Error sign message", err);
                return ["err", err.toString()];
            }
        });
    
        try
        {
            const response = yield ws.call('Status', [ '2.2.0.0', network ]); 
            yield put({type: actionTypes.WSRPC_STATUS_SUCCESS, payload: response}); 
            
            yield ws.call('Monitor', [accountId]);
    
            // and balance
            const balanceResp = yield ws.call('Balance', [accountId]); 
            yield put({type: actionTypes.WALLET_BALANCE, payload: balanceResp.result}); 
        }    
        catch(error) {
            yield put({type: actionTypes.WSRPC_STATUS_FAILED, payload: error});
        };
    
        yield put({ type: actionTypes.WSRPC_CREATED });
}

function* wsrpc (action) {
    network = action.payload.network;
    accountId = action.payload.accountId;
    dispatch = yield getContext('dispatch');

    yield createWS(network);
}

function* savePref(action) {
    var pdata = yield persist.getData();
    pdata.pref.network = action.payload.network;
    yield persist.setData(pdata);

    // need reconnect to api
    yield ws.close();
    network = pdata.pref.network;
    yield createWS(network);
}


export default function* rootSaga() {
    console.log('rootSaga is running.');
    yield takeLatest(actionTypes.STORE_INIT, checkWalletExists);
    yield takeEvery(actionTypes.WALLET_RESTORE, restoreWallet);
    yield takeEvery(actionTypes.WALLET_REMOVE, removeWallet);
    yield takeEvery(actionTypes.WALLET_OPEN, openWallet);
    yield takeEvery(actionTypes.WSRPC_CREATE, wsrpc);
    yield takeEvery(actionTypes.WALLET_RECEIVE, receive);
    yield takeEvery(actionTypes.WALLET_CHANGE_NETWORK, savePref);
}

