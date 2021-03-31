import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from "react-router-dom";
import { Badge } from 'antd';
import {subscribe} from 'redux-subscriber';

import { InfoIcon, PayIcon, SwapIcon } from '../lyra/icons';
import * as actionTypes from "./redux/actionTypes";

const mapStateToProps = state => {
  return {
    opening: state.app.opening,
    balance: state.app.wallet.balance,
    unrecvcnt: state.app.wallet.unrecvcnt,
    unrecvlyr: state.app.wallet.unrecvlyr,
  };
}
class FrontFormCls extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      balancemsg: "",
      unrecvmsg: "",  
      unsub: null,
      tag: null,
    };
  }

  receive() {
    this.setState({tag: '_' + Math.random().toString(36).substr(2, 9)});
    this.props.dispatch({type: actionTypes.WALLET_RECEIVE, payload: {
      accountId: this.props.accountId,
      tag: this.state.tag
    }});
  }

  componentDidMount() {
    if(typeof this.state.unsub === 'function')
      this.state.unsub();

    const unsub = subscribe('app.wallet', store => {
      this.update(store);
    });

    this.setState({unsub: unsub});

    this.update2();
  }

  update2() {
    if(this.props.opening && this.props.balance !== undefined)
    {
      var msg = this.props.balance.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      this.setState({balancemsg: msg});
      if(this.props.unrecvcnt === 0)
      {
        this.setState( { unrecvmsg: "" } );
      }      
      else {
        if(this.props.unrecvlyr === 0)
          this.setState( { unrecvmsg: "+ ? LYR" } );
        else
          this.setState( { unrecvmsg: "+ " + this.props.unrecvlyr.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " LYR" } );
      } 
    }
  }

  update(store) {
    let state = store;
    if(state.app.opening && state.app.wallet.balance !== undefined)
    {
      var msg = state.app.wallet.balance.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      this.setState({balancemsg: msg});
      if(state.app.wallet.unrecvcnt === 0)
      {
        this.setState( { unrecvmsg: "" } );
      }      
      else {
        if(state.app.wallet.unrecvlyr === 0)
          this.setState( { unrecvmsg: "+ ? LYR" } );
        else
          this.setState( { unrecvmsg: "+ " + state.app.wallet.unrecvlyr.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " LYR" } );
      } 
    }
  }

  componentWillUnmount () {
    if(typeof this.state.unsub === 'function')
      this.state.unsub();
  }

  render() {
    if(!this.props.opening)
      return <Redirect to="/open" />;

    return (      
      <div>
        <div onClick={() => this.receive()} >
          <Badge count={this.props.unrecvcnt}>
            <span className="blas" style={{ fontWeight: 'bolder' }} id="bala">{this.state.balancemsg}</span>
          </Badge>
            &nbsp;&nbsp;<span style={{ fontFamily: 'Times', fontSize: '3vw' }}>LYR</span>
        </div>
        <div onClick={() => this.receive()} style={{ fontFamily: 'Times', fontSize: '12pt' }}>
          {this.state.unrecvmsg}
        </div>
        <p>&nbsp;</p>
        <div>
          <Link to="/info">
            <InfoIcon></InfoIcon>
          </Link>
          <Link to="/send">
            <PayIcon></PayIcon>
          </Link>
          <Link to="/swap">
            <SwapIcon></SwapIcon>
          </Link>
        </div>               
      </div>
    );
  }
}

const FrontForm = connect(mapStateToProps)(FrontFormCls);

export default FrontForm;