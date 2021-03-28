import { applyMiddleware, createStore } from "redux";
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import createSagaMiddleware from 'redux-saga';

import rootSaga from './sagas';
import persist from '../../lyra/persist';
import * as actionTypes from "./actionTypes";
//import { openWallet } from "./actions";

const initState = {
    wallet: {
        network: "",
        accountId: "",
        balance: 0,
        unrecv: 0,
        unrecvlyr: 0,
    },
    existing: false,
    pending: false,
    name: "default",
    opening: false,
    password: "",
    error: null
}

const reducer = (state = initState, action) => {
    switch(action.type) {
        case "STORE_INIT_DONE": return {
            ...state,
            existing: action.payload !== undefined && action.payload !== null
        }
        case "STORE_INIT_REJECTED": return {
            ...state,
            existing: false
        }
        case actionTypes.WALLET_RESTORE_DONE: return {
             ...state,
             existing: true,
             opening: false,
        };
        case actionTypes.WALLET_REMOVE_DONE: return {
            ...state,
            existing: false,
            opening: false,
        };     
        case actionTypes.WALLET_OPEN: return {
            ...state,
            opening: false,
            name: "",
            wallet: { },
            error: null
        };   
        case actionTypes.WALLET_OPEN_DONE: return {
            ...state,
            opening: true,
            name: action.payload.wallets[0].name,
            wallet: {
                network: action.payload.network,
                accountId: action.payload.wallets[0].accountId,
            }
        };
        case actionTypes.WALLET_OPEN_FAILED: return {
            ...state,
            opening: false,
            error: action.payload
        };
        default: {
            return state;
        }
    }    
}

const logger = (store) => (next) => (action) => {
    console.log("action fired", action);
    next(action);
}

const sagaMiddleware = createSagaMiddleware();

const middleware = applyMiddleware(promise, logger, thunk, sagaMiddleware);

const store = createStore(reducer, middleware);

store.subscribe(() => {
    console.log("store changed", store.getState())
})

sagaMiddleware.run(rootSaga);

export const action = type => store.dispatch({type});
//export const actionx = (type, payload) => store.dispatch({type, payload});

action(actionTypes.STORE_INIT);
//store.dispatch(openWallet("default", "aaa"));

export default store;
