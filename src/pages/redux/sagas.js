import { put, takeLatest, takeEvery, all } from 'redux-saga/effects'

import * as actionTypes from './actionTypes';
import persist from '../../lyra/persist';
import LyraCrypto from '../../lyra/crypto';

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
    yield put({type: actionTypes.WALLET_RESTORE_DONE, payload: wds});
}


export default function* rootSaga() {
    console.log('rootSaga is running.');
    yield takeLatest(actionTypes.STORE_INIT, checkWalletExists);
    yield takeEvery(actionTypes.WALLET_RESTORE, restoreWallet);
}

