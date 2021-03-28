import { applyMiddleware, createStore } from "redux";
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import persist from '../../lyra/persist';
import * as actionTypes from "./actionTypes";
//import { openWallet } from "./actions";

const initState = {
    wallet: {
        accountId: "",
        balance: 0,
        unrecv: 0,
        unrecvlyr: 0,
    },
    existing: false,
    pending: false,
    name: "default",
    opening: false,
    password: ""
}

const reducer = (state = initState, action) => {
    switch(action.type) {
        case "STORE_INIT_FULFILLED": return {
            ...state,
            existing: action.payload !== undefined && action.payload !== null
        }
        case "STORE_INIT_REJECTED": return {
            ...state,
            existing: false
        }
        // case actionTypes.WALLET_OPEN: {
            
        //     break;
        // }
        default: {
            return state;
        }
    }    
}

const logger = (store) => (next) => (action) => {
    console.log("action fired", action);
    next(action);
}

const middleware = applyMiddleware(promise, logger, thunk);

const store = createStore(reducer, middleware);

store.subscribe(() => {
    console.log("store changed", store.getState())
})

store.dispatch({type: actionTypes.STORE_INIT, payload: persist.checkData()});
//store.dispatch(openWallet("default", "aaa"));

export default store;

