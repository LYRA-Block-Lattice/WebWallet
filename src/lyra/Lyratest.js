import React, { Component } from 'react';
import { Badge } from 'antd';
import { Modal } from 'antd';
import localforage from "localforage";

import LyraCrypto from './crypto';
import JsonRpcClient from './jsonrpcclient';
import { InfoIcon, PayIcon, SwapIcon } from './icons';
import Send from './SendForm';

class Lyratest extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      pvk: "54ff7b8aa7730b5fb41676f55c721967a2dd553678a40b856b580db9f946cda7",
      puk: "046f8815c5e79ba81f1cc9e4f8a311c70d8fa55e9792bd0d682e8a7ac157f28187b31edf7555b7b60ca6623150e7dd19d23d1d9ac2fc64d89a73bb2386247f2082",
      accountId: "LFbJq1N4fSdSLudWWACgYfpwKfpLrekT6ECR6knCX2br66wydpNpbFywoT6FrSwvoVSrb8zPzrcrFG4K7q7i8UVFKtkfnN",
      balance: 0,
      unrecv: 0,
      unrecvlyr: 0,
      unrecvmsg: "",  
      showAddr: false,
      showSend: false,
      showSendConfirm : false,
      showSwap: false,
    };
    this.send = this.send.bind(this)
  }

  render() {
    return (      
      <div style={{ color: 'white' }}>
        <div onClick={() => this.receive()}>
          <Badge count={this.state.unrecv}>
            <span className="blas" style={{ color: 'orange', fontWeight: 'bolder' }} id="bala">{this.state.balance.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span>
          </Badge>
            &nbsp;&nbsp;<span style={{ fontFamily: 'Times', color: 'white', fontSize: '3vw' }}>LYR</span>
        </div>
        <div style={{ fontFamily: 'Times', fontSize: '12pt' }}>
          {this.state.unrecvmsg}
        </div>
        <p>&nbsp;</p>
        <div>
          <InfoIcon onClick={() => this.setState({ showAddr: true })}></InfoIcon> 
          <PayIcon onClick={() => this.setState({ showSend: true })}></PayIcon>
          <SwapIcon onClick={() => this.setState({ showSwap: true })}></SwapIcon>
        </div>               
        <Modal title="My Wallet Address" 
          visible={this.state.showAddr}
          onOk={() => this.setState({ showAddr: false })}
          onCancel={() => this.setState({ showAddr: false })}
          >
          <div style={{ fontSize: '8pt' }}>{this.state.accountId}</div>
        </Modal>
        <Modal title="Send Token"
          footer={null}
          visible={this.state.showSend}
          onOk={() => this.send()}
          onCancel={() => this.setState({ showSend: false })}
          >
          <Send func={this.send}></Send>
        </Modal>
        <Modal title="Token Swap"
          visible={this.state.showSwap}
          onOk={() => this.setState({ showSwap: false })}
          onCancel={() => this.setState({ showSwap: false })}
        >
          <p>TBA</p>
        </Modal>
        <Modal title="Confirm Token Sending"
          visible={this.state.showSendConfirm}
        >
          <p>Send from: </p>
          <p>Send to: </p>
          <p>Token: </p>
          <p>Amount: </p>
        </Modal>
      </div>
    );
  }

  lc;
  ws;
  lapp;

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

  componentDidMount() {
    console.log("lyra app started.");
    this.lapp = this;
    this.lc = new LyraCrypto();    

    console.log('localforage is: ', localforage);

    var aid = this.lc.lyraEncPub(this.state.puk);
    console.log("pub account id is " + aid);
    require('assert').equal(aid, this.state.accountId);

    this.ws = new JsonRpcClient({
      socketUrl: 'wss://testnet.lyra.live/api/v1/socket',
      oncallback: (resp) => {
        if (resp.method === "Sign") {
          console.log("Signing " + resp.params[0] + " of " + resp.params[1]);
          var signt = this.lc.lyraSign(resp.params[1], this.state.pvk);
          return ["der", signt];
        }
        else {
          console.log("unsupported server call back method: " + resp.method);
          return null;
        }
      },
      onmessage: (event) => {
        console.log(`[message] Data received from server: ${event.data}`);
        var result = JSON.parse(event.data);
        if (result.method === "Notify") {
          var news = result.params[0];
          console.log("WS Notify: " + news.catalog)
          if (news.catalog === "Receiving") {
            this.setState({ unrecvlyr: this.state.unrecvlyr + news.content.funds.LYR });
            this.setState({ unrecv: this.state.unrecv + 1 });
            this.updurcv();
          }
        }
      },
      onopen: (event) => {
        console.log("wss open.");

        this.ws.call('Monitor', [ this.state.accountId ]);
        this.ws.call('Balance', [ this.state.accountId ], (resp) => this.lapp.updbal(resp), this.error_cb);
        console.log("wss created.");
      },
      onclose: () => {
        console.log("wss close.");
        // lol force reopen
        this.ws.call('Status', [ '2.2', 'testnet' ], this.success_cb, this.error_cb);
      },
      onerror: function (event) {
        console.log("wss error.");
      }
    });

    this.ws.call('Status', [ '2.2', 'testnet' ], this.success_cb, this.error_cb);
  }

  updbal(resp) {
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
  success_cb(data) {
    console.log("success cb");
    console.log(data);
  }
  error_cb(data) {
    console.log("error cb: ");
    console.log(data);
  }
}

export default Lyratest;