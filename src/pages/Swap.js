import { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import DexMain from "./dex";

class SwapPage extends Component {
  render() {
    if (!this.props.loggedin) {
      return <Redirect to="/swap/signin" />;
    }

    return <DexMain />;
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.dex.userId,
    loggedin: state.dex.loggedin,
  };
};

const Swap = connect(mapStateToProps)(SwapPage);
export default Swap;
