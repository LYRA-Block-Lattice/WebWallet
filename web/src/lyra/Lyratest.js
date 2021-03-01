import React, { Component } from 'react';
import LyraCrypto from './crypto';
import JsonRpcClient from './jsonrpcclient';

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
    };
  }
  render() {
    return (
      <div onClick={() => this.receive()}>
        <div style={{ fontSize: '8pt' }}>{this.state.accountId}</div>
        <div className="blas">
          <span style={{ color: 'orange', fontWeight: 'bolder' }} id="bala">{this.state.balance}</span>
          <span style={{ fontSize: '18pt' }}>LYR</span>
        </div>
        <div style={{ fontSize: '12pt' }}>
          {this.state.unrecvmsg}
        </div>
      </div>
    );
  }

  lc;
  ws;
  lapp;

  receive() {
    this.ws.call('Receive', [ this.state.accountId ], (resp) => this.lapp.updbal(resp), this.error_cb);
  }

  componentDidMount() {
    console.log("lyra app started.");
    this.lapp = this;
    this.lc = new LyraCrypto();

    var aid = this.lc.lyraEncPub(this.state.puk);
    console.log("pub account id is " + aid);
    require('assert').equal(aid, this.state.accountId);

    // instantiate Client and connect to an RPC server
    //var ws = new WebSocket('wss://192.168.3.62:4504/api/v1/socket');
    this.ws = new JsonRpcClient({
      ajaxUrl: '/api/v1/socket',
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
    if (resp.unreceived && this.unrecv === 0) {
      this.setState( { unrecv: this.state.unrecv + 1} );
    }
    this.updurcv();
  }
  updurcv() {
    if(this.state.unrecv === 0)
    {
      this.setState( { unrecvmsg: "" } );
    }      
    else {
      if(this.state.unrecvlyr === 0)
        this.setState( { unrecvmsg: "+ ? LYR" } );
      else
        this.setState( { unrecvmsg: "+ " + this.state.unrecvlyr + " LYR" } );
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