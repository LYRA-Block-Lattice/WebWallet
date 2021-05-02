import { Component } from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";

import * as actionTypes from "../redux/actionTypes";
import Xrp from "./Coins/xrp";

class MainPage extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.dispatch({ type: actionTypes.DEX_LOGOUT });
  }

  render() {
    return (
      <div>
        <h1>Hello {this.props.userId}, Welcome to Lyra DeX!</h1>
        <Xrp />
        <div>
          {" "}
          <Button
            color="primary"
            fullWidth
            onClick={this.logout}
            variant="contained"
          >
            Log Out
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.dex.userid,
    loggedin: state.dex.loggedin,
  };
};

const Main = connect(mapStateToProps)(MainPage);
export default Main;
