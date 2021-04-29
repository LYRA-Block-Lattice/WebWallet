import * as actionTypes from "./actionTypes";

const initState = {
    wallet: {
        accountId: "",
        balance: 0,
        unrecvcnt: 0,
        unrecvlyr: 0,
    },
    network: "",
    existing: false,
    pending: false,
    name: "default",
    opening: false,
    password: "",
    tx: {
        tag: null,  
        result: null,
    },
    error: null,
}

const walletReducer = (state = initState, action) => {
    if(action === undefined) { return state }

    switch(action.type) {
        case actionTypes.WALLET_BALANCE: 
            if(action.payload.balance !== undefined) {
                return {
                    ...state,
                    wallet: {
                        ...state.wallet,
                        balance: action.payload.balance['LYR'],
                        unrecvcnt: action.payload.unreceived ? state.wallet.unrecvcnt + 1 : 0,
                        unrecvlyr: action.payload.unreceived ? state.wallet.unrecvcnt : 0
                    }
                }
            }else{
                return {
                    ...state,
                    wallet: {
                        ...state.wallet,
                        balance: 0,
                        unrecvcnt: action.payload.unreceived ? state.wallet.unrecvcnt + 1 : 0,
                        unrecvlyr: action.payload.unreceived ? state.wallet.unrecvcnt : 0
                    }
                }
            }
        case actionTypes.STORE_INIT_DONE: return {
            ...state,
            existing: action.payload !== undefined && action.payload !== null
        }
        case actionTypes.WALLET_RECEIVE:
        case actionTypes.WALLET_SEND: return {
            ...state,
            error: null,
            tx: {
                tag: action.payload.tag,  
                result: "pending",
            },
        }
        case actionTypes.WSRPC_CALL_SUCCESS: return {
            ...state,
            error: null,
            tx: {
                tag: action.payload.tag,
                result: "success",
            },
        }
        case actionTypes.WSRPC_CALL_FAILED: return {
            ...state,
            error: action.payload.error,
            tx: {
                tag: action.payload.tag,
                result: "failed",
            },
        }
        case actionTypes.WALLET_CREATE_DONE: 
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
            error: null
        };   
        case actionTypes.WALLET_OPEN_DONE: return {
            ...state,
            opening: true,
            name: action.payload.wallets[0].name,
            wallet: {
                ...state.wallet,                
                accountId: action.payload.wallets[0].accountId,
            },
            network: action.payload.pref.network,
        };
        case actionTypes.WALLET_CLOSED: return {
            ...state,
            opening: false,
            name: '',
            wallet: { },
        };
        case actionTypes.WALLET_OPEN_FAILED: return {
            ...state,
            opening: false,
            error: action.payload
        };
        case actionTypes.WSRPC_SERVER_NOTIFY_RECV: 
            return {
            ...state,
            wallet: {
                ...state.wallet,
                unrecvcnt: state.wallet.unrecvcnt + 1,
                unrecvlyr: state.wallet.unrecvlyr + action.payload.funds["LYR"]
            }
        };
        case actionTypes.WSRPC_SERVER_NOTIFY_SETTLEMENT: 
            return {
            ...state,
            wallet: {
                ...state.wallet,
                balance: state.wallet.balance + action.payload.funds['LYR'],
                unrecvcnt: state.wallet.unrecvcnt > 0 ? state.wallet.unrecvcnt - 1 : 0,
                unrecvlyr: state.wallet.unrecvlyr > action.payload.funds['LYR'] ? state.wallet.unrecvlyr - action.payload.funds["LYR"] : 0
            }
        };
        case actionTypes.WSRPC_CLOSED:return {
            ...state,
            wallet: {
                ...state.wallet,
                unrecvcnt: 0,
                unrecvlyr: 0
            }
        };
        case actionTypes.WALLET_CHANGE_NETWORK: return {
            ...state,
            network: action.payload.network,
            wallet: {
                ...state.wallet,
                balance: 0,
                unrecvcnt: 0,
                unrecvlyr: 0
            }
        };
        default: {
            return state;
        }
    }    
}

export default walletReducer;