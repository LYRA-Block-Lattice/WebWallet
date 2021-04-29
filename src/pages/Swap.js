import { Component } from "react";
import { connect } from "react-redux";
import SignUp from "./dex/Auth/Auth";
import Main from "./dex/Main";

class SwapPage extends Component {
  render() {
    if (!this.props.loggedin) {
      return <SignUp />;
    }

    return <Main />;
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
