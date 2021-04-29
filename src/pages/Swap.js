import { Component } from "react";
import { connect } from "react-redux";
import SignUp from "./dex/Auth/Auth";

class SwapPage extends Component {
  render() {
    if (!this.props.loggedin) {
      return <SignUp />;
    }

    return <div>swap token! TBA</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    loggedin: state.dex.loggedin,
  };
};

const Swap = connect(mapStateToProps)(SwapPage);
export default Swap;
