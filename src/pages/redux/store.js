import { applyMiddleware, createStore, compose } from "redux";

//import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import createSagaMiddleware from 'redux-saga';
import initSubscriber from 'redux-subscriber';

import { routerMiddleware } from 'connected-react-router'
import rootReducer from './reducers'

import rootSaga from './sagas';

//export const action = type => store.dispatch({type});
//export const actionx = (type, payload) => store.dispatch({type, payload});

const logger = (store) => (next) => (action) => {
    console.log("action fired", action);
    next(action);
}

const context = {
    dispatch: () => { },
}

const sagaMiddleware = createSagaMiddleware({
    context
})

export default function configureStore(initialState, history) {
    let store = {};
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
 
    let createStoreWithMiddleware = composeEnhancers(
        applyMiddleware(sagaMiddleware, routerMiddleware(history), logger, thunk, promise)
    )(createStore);
    
    //const middleware = applyMiddleware(promise, logger, thunk, sagaMiddleware, routerMiddleware(history));

    store = createStoreWithMiddleware(rootReducer(history), initialState);
  
    // // Hot reloading
    // if (module.hot) {
    //   // Enable Webpack hot module replacement for reducers
    //   module.hot.accept('./reducers', () => {
    //     store.replaceReducer(createRootReducer(history));
    //   });
    // }
  
    //const store = createStore(reducer, initState, composeWithDevTools(middleware));
    context.dispatch = store.dispatch

    store.subscribe(() => {
        console.log("store changed", store.getState())
    })

    // "initSubscriber" returns "subscribe" function, so you can use it
    initSubscriber(store);

    store.sagaTask = sagaMiddleware.run(rootSaga);

    store.dispatch({type: 'STORE_INIT'});
    //store.dispatch(openWallet("default", "aaa"));

    return store
  }

