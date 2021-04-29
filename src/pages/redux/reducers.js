import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import walletReducer from "./walletreducer";
import dexReducer from "./dexreducer";

const rootReducer = (history) =>
  combineReducers({
    app: walletReducer,
    router: connectRouter(history),
    dex: dexReducer,
  });

export default rootReducer;
