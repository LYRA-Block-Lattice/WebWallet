import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from "react-router-dom";
import { Badge } from 'antd';
import {subscribe} from 'redux-subscriber';

import { InfoIcon, PayIcon, SwapIcon } from '../lyra/icons';
import store from './redux/store';
import * as actionTypes from "./redux/actionTypes";

const mapStateToProps = state => {
  console.log("state is", state);
  return {
    opening: state.opening,
    balance: state.wallet.balance,
    unrecvcnt: state.wallet.unrecvcnt,
    unrecvlyr: state.wallet.unrecvlyr,
  };
}
class FrontFormCls extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      unrecvmsg: "",  
      unsub: null
    };
    this.send = this.send.bind(this)
  }

  componentDidMount() {
    const unsub = subscribe('wallet', state => {
      if(state.opening)
      {
        if(state.wallet.unrecvcnt === 0)
        {
          this.setState( { unrecvmsg: "" } );
        }      
        else {
          if(state.wallet.unrecvlyr === 0)
            this.setState( { unrecvmsg: "+ ? LYR" } );
          else
            this.setState( { unrecvmsg: "+ " + state.wallet.unrecvlyr.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " LYR" } );
        } 
      }
    });

    this.setState({unsub: unsub});
  }

  componentWillUnmount () {
    this.state.unsub();
  }

  render() {
    if(!this.props.opening)
      return <Redirect to="/open" />;

    return (      
      <div style={{ color: 'white' }}>
        <div>
          <Badge count={this.props.unrecvcnt}>
            <span className="blas" style={{ color: 'orange', fontWeight: 'bolder' }} id="bala">{/*this.props.opening ? this.props.balance.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,') : "0"*/}</span>
          </Badge>
            &nbsp;&nbsp;<span style={{ fontFamily: 'Times', color: 'white', fontSize: '3vw' }}>LYR</span>
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

  send(values) {
    console.log("send token by values: " + values);
    // this.setState({showSendConfirm: true});
    // return;
    // do validate 
    this.ws.call('Send', [ 
      this.state.accountId,
      values.amount,
      values.destaddr,
      values.tokenname
    ], (resp) => this.lapp.updbal(resp), this.error_cb);
    this.setState({ showSend: false });
  }
  receive() {
    store.dispatch({type: actionTypes.WALLET_RECEIVE});
  }

  updbal(resp) {
    if(resp.balance)
    {
      this.setState( { balance: resp.balance.LYR} );
      if(!resp.unreceived)
      {
        this.setState( { unrecv: 0 } );
        this.setState( { unrecvlyr: 0 } );
      }
      if (resp.unreceived && this.state.unrecv === 0) {
        this.setState( { unrecv: this.state.unrecv + 1} );
      }
      this.updurcv(resp.unreceived);
    }
  }
  updurcv(un) {
     
  }
}

const FrontForm = connect(mapStateToProps)(FrontFormCls);

export default FrontForm;