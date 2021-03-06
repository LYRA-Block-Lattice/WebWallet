import React from 'react';
import './App.less';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from "react-redux";
import store from "./pages/todo/redux/store";
import TodoApp from "./pages/TodoApp";

import Send from './pages/SendForm';
import Swap from './pages/SwapForm';
import MainPage from './pages/MainPage';
import Info from './pages/Info';

import useToken from './pages/useToken';

function sendToken(token, e) {
  console.log("send token to: " + e.destaddr);

  this.ws.call('Send', [ 
    this.state.accountId,
    e.amount,
    e.destaddr,
    e.tokenname
  ], (resp) => this.lapp.updbal(resp), this.error_cb);
}

function App() {
  const { token } = useToken();

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/info">
            <Info />
          </Route>
          <Route path="/send">
            <Send onsend={(e) => sendToken(token, e)}/>
          </Route>
          <Route path="/swap">
            <Swap />
          </Route>
          <Route path="/todo">
            <TodoApp />
          </Route>
          <Route path="/">
            <MainPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
