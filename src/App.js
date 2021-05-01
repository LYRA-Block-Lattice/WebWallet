import React, { Component, Fragment } from "react";
import "./App.css";

import { withSnackbar } from "notistack";
//import * as serviceWorker from "./serviceWorkerRegistration";
import { Button } from "@material-ui/core";

import Main from "./pages/Main";

//const isIOS = !!global.navigator.userAgent && /iPad|iPhone|iPod/.test(global.navigator.userAgent)

const getAppVersion = () => {
  const url = `/version.json?c=${Date.now()}`;
  const headers = {
    "Cache-Control": "no-cache, no-store, must-revalidate",
  };

  return fetch(url, { headers }).then((response) => response.json());
};

const handleScreenFocus = () => {
  if (true) {
    const currentVersion = global.localStorage.getItem("appVersion");

    getAppVersion().then((data) => {
      if (data.version !== currentVersion) {
        console.log("Found new version.");
        global.localStorage.setItem("appVersion", data.version);

        window.location.reload();
      }
    });
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      promptRefresh: false,
    };
  }

  updateServiceWorker = () => {
    const { waitingWorker } = this.state;
    waitingWorker && waitingWorker.postMessage({ type: "SKIP_WAITING" });
    this.setState({ promptRefresh: false });
    window.location.reload();
  };

  refreshAction = (key) => {
    //render the snackbar button
    return (
      <Fragment>
        <Button
          className="snackbar-button"
          size="small"
          onClick={this.updateServiceWorker}
        >
          {"refresh"}
        </Button>
      </Fragment>
    );
  };

  componentDidMount() {
    const { enqueueSnackbar } = this.props;

    handleScreenFocus();

    if (this.state.promptRefresh)
      //show snackbar with refresh button
      enqueueSnackbar("A new version was released", {
        persist: true,
        variant: "success",
        action: this.refreshAction(),
      });
  }

  handleRefreshForUpdate = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistration()
        .then((reg) => {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
          window.location.reload();
        })
        .catch((err) => console.log("Could not get registration: ", err));
    }
  };

  render() {
    return (
      <div className="App">
        <Main />
      </div>
    );
  }
}

export default withSnackbar(App); //uses the snackbar context
