import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import Withdraw from "./Withdraw";
import Deposit from "./Deposit";
import Swap from "./Swap";
import Overview from "./Overview";

const Wallets = () => {
  let match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/deposit`}>
        <Deposit />
      </Route>
      <Route path={`${match.path}/withdraw`}>
        <Withdraw />
      </Route>
      <Route path={`${match.path}/swap`}>
        <Swap />
      </Route>
      <Route path={`${match.path}`}>
        <div>
          <h3>your wallets</h3>
          <Overview />
        </div>
      </Route>
    </Switch>
  );
};

export default Wallets;
