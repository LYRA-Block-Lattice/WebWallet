import React from 'react';
import './App.less';
import { Link, Route, Switch } from 'react-router-dom';

import CreateWallet from './pages/CreateWallet';
import RestoreWallet from './pages/RestoreWallet';
import Preference from './pages/PrefForm';
import Send from './pages/SendForm';
import Swap from './pages/SwapForm';
import MainPage from './pages/MainPage';
import Info from './pages/Info';
import OpenWallet from './pages/OpenWallet';

function App() {
  return (
    <div>
      <div className="ldark">
        <Link to="/"><img src="/images/logo2.png" alt="Logo"></img></Link>
      </div>
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
        <Route path="/open">
          <OpenWallet />
        </Route>
        <Route path="/">
          <MainPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
