import React from 'react';
import PropTypes from 'prop-types'
import './App.less';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import CreateWallet from './pages/CreateWallet';
import RestoreWallet from './pages/RestoreWallet';
import Preference from './pages/PrefForm';
import Send from './pages/SendForm';
import Swap from './pages/SwapForm';
import MainPage from './pages/MainPage';
import Info from './pages/Info';
import OpenWallet from './pages/OpenWallet';

import { HomeIcon } from './lyra/icons';

function App({history}) {
  return (
    <ConnectedRouter history={history}>
      <BrowserRouter>
        <div className="ldark">
          <Link to="/"><HomeIcon /></Link>
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
      </BrowserRouter>
    </ConnectedRouter>
  );
}

App.propTypes = {
  history: PropTypes.object,
}

export default App;
