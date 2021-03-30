import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import walletReducer from './wallet';

const rootReducer = (history) => combineReducers({
    app: walletReducer,
    router: connectRouter(history)
  })

 export default rootReducer;