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
        yield put({type: actionTypes.WSRPC_CREATE, payload: {
            network: pdata.network,
            accountId: wallets[0].accountId
        } });
        sessionStorage.setItem('token', JSON.stringify({pass: action.payload.password, pvk: pvk}));
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

/*function* wscallback(servercall) {
    while(true)
    {
        console.log("wscallback called in while loop", servercall);
        let resp = yield servercall;
        console.log("wscallback from server", resp);
        if (resp.method === "Notify") {            
            console.log("Notify of", resp.params[0].catalog);
            // if(resp.params[0].catalog === "Receiving") {
            //     yield put({type: actionTypes.WSRPC_SERVER_NOTIFY_RECV, payload: resp.params[0]});
            // }    
            // else        
            yield null;
        }
        else if (resp.method === "Sign") {

        }
        else {
            console.log("unsupported server call back method: " + resp.method);
            yield null;
        }
    }

}

function* wsonopen() {
    console.log(new Date().toUTCString() + ' wss open.');

    yield ws.call('Monitor', [accountId]);
    //ws.call('Balance', [accountId], (resp) => this.lapp.updbal(resp), this.error_cb);
    console.log("wss created and monitored.");

    //yield put({ type: actionTypes.WSRPC_CONNECTED });
}

function* wsonclose() {
    console.log("wss close.");
    yield put({ type: actionTypes.WSRPC_CLOSED });
    // lol force reopen

    console.log("force wss reopen.");
}

function* wsonerror(err) {
    console.log("wss error.", err);
    yield put({ type: actionTypes.WSRPC_ERROR, payload: err });
}*/

function* wsrpc (action) {
    network = action.payload.network;
    accountId = action.payload.accountId;

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

    dispatch = yield getContext('dispatch');

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
    
        const userToken = JSON.parse(sessionStorage.getItem('token'));
        var signt = LyraCrypto.lyraSign(msg, userToken.pvk);
        console.log("Signature", signt);
        
        return ["der", signt];
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
        yield put({type: actionTypes.WSRPC_STATUS_FAILED});
    };

    // yield ws.call('Status', [ '2.2.0.0', 'devnet' ], 
    //     a => console.log("connected."), 
    //     err => console.log("connect error"));

    yield put({ type: actionTypes.WSRPC_CREATED });
}


export default function* rootSaga() {
    console.log('rootSaga is running.');
    yield takeLatest(actionTypes.STORE_INIT, checkWalletExists);
    yield takeEvery(actionTypes.WALLET_RESTORE, restoreWallet);
    yield takeEvery(actionTypes.WALLET_REMOVE, removeWallet);
    yield takeEvery(actionTypes.WALLET_OPEN, openWallet);
    yield takeEvery(actionTypes.WSRPC_CREATE, wsrpc);
    yield takeEvery(actionTypes.WALLET_RECEIVE, receive);
}

