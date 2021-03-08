import React from 'react';
import './App.less';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LyraContext from './lyra/context';

import CreateWallet from './pages/CreateWallet';
import RestoreWallet from './pages/RestoreWallet';
import Preference from './pages/PrefForm';
import Send from './pages/SendForm';
import Swap from './pages/SwapForm';
import MainPage from './pages/MainPage';
import Info from './pages/Info';

function App() {
  return (
    <LyraContext.Provider>
      <BrowserRouter>
        <Switch>
          <Route path="/info">
            <Info />
          </Route>
          <Route path="/send">
            <Send />
          </Route>
          <Route path="/swap">
            <Swap />
          </Route>
          <Route path="/pref">
            <Preference />
          </Route>
          <Route path="/create">
            <CreateWallet />
          </Route>
          <Route path="/restore">
            <RestoreWallet />
          </Route>
          <Route path="/">
            <MainPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </LyraContext.Provider>
  );
}

export default App;
