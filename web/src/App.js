import React from 'react';
import { createStore } from "redux";
import { Provider } from "react-redux";

import Lyratest from './lyra/Lyratest';

import logo from './logo.png';
import './App.less';

// test
import rootReducer from "./todo/useReducers";

const store = createStore(rootReducer);


function App() {
  return (
    <div className="App">
      <Provider store={store}>
        
      </Provider>
      
      <header className="App-header">        
        <img src={logo} className="App-logo" alt="logo" />
        <Lyratest></Lyratest>
      </header>      
    </div>
  );
}

export default App;
