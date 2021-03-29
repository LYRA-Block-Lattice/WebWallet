import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import { Badge } from 'antd';

import { InfoIcon, PayIcon, SwapIcon } from '../lyra/icons';

class FrontForm extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      balance: 0,
      unrecv: 0,
      unrecvlyr: 0,
      unrecvmsg: "",  
    };
    this.send = this.send.bind(this)
  }

  render() {
    if(this.state.accountId === null)
      return <Redirect to="/open" />;

    return (      
      <div style={{ color: 'white' }}>
        <div>
          <Badge count={this.state.unrecv}>
            <span className="blas" style={{ color: 'orange', fontWeight: 'bolder' }} id="bala">{this.state.balance.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span>
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
    this.ws.call('Receive', [ this.state.accountId ], (resp) => this.lapp.updbal(resp), this.error_cb);
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
    if(this.state.unrecv === 0)
    {
      if(un)
        this.setState( { unrecvmsg: "+ ? LYR" } );
      else
        this.setState( { unrecvmsg: "" } );
    }      
    else {
      if(this.state.unrecvlyr === 0)
        this.setState( { unrecvmsg: "+ ? LYR" } );
      else
        this.setState( { unrecvmsg: "+ " + this.state.unrecvlyr.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " LYR" } );
    }      
  }
}

export default FrontForm;