import React, { Component } from 'react';
import LyraCrypto from './crypto';

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

  receive() {
    this.ws.call('Receive', [ this.state.accountId ] ).then(function (result) {
      console.log("ws Receive got reply");
      this.updbal(result);
    }).catch(err => {
      console.log("ws Receive error");
      console.log(err);
    });
  }

  componentDidMount() {
    console.log("lyra app started.");

    this.lc = new LyraCrypto();

    var aid = this.lc.lyraEncPub(this.state.puk);
    console.log("pub account id is " + aid);
    require('assert').equal(aid, this.state.accountId);

    var lapp = this;

    var WebSocket = require('rpc-websockets').Client

    // instantiate Client and connect to an RPC server
    //var ws = new WebSocket('wss://192.168.3.62:4504/api/v1/socket');
    this.ws = new WebSocket('wss://testnet.lyra.live/api/v1/socket');
    
    this.ws.on('open', function () {
      console.log("ws open. " + new Date().toLocaleString());
      // call an RPC method with parameters
      lapp.ws.call('Status', [ '2.2', 'testnet' ]).then(function (result) {
        console.log("ws status got reply");
        //require('assert').equal(result, 8)
      })

      lapp.ws.call('Balance', [ lapp.state.accountId ] ).then(function (result) {
        console.log("ws Balance got reply");
        lapp.updbal(result);
        //require('assert').equal(result, 8)
      }).catch(err => {
        console.log("ws balance error");
        console.log(err);
      });

      lapp.ws.call('Monitor', [ lapp.state.accountId ]);

      lapp.ws.on('Sign', function (resp) {
        console.log("Signing " + resp[0] + " of " + resp[1]);
          var signt = lapp.lc.lyraSign(resp[1], lapp.state.pvk);
          return ["der", signt];
      })

      // close a websocket connection
      //ws.close()
    });

    this.ws.on("error", (err) => {
      console.log("WS error: " + err);
    });
    this.ws.on("close", () => console.log("WS: closed"));
    this.ws.on("Notify", (news) => {
      console.log("WS Notify: " + news[0].catalog)
      if(news[0].catalog === "Receiving") {
        this.setState( { unrecvlyr: this.state.unrecvlyr + news[0].content.funds.LYR });
        this.setState( { unrecv: this.state.unrecv + 1 });
        this.updurcv();
      }
    }); 
  }

  updbal(resp) {
    this.setState( { balance: resp.balance.LYR} );
    if (resp.unreceived && this.unrecv === 0) {
      this.setState( { unrecv: this.state.unrecv + 1} );
      this.updurcv();
    }
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
  /*  $(document).ready(function(){
  
        $("#pubkey").text(accountId);
  
    console.log("create wss.");
        foo = new $.JsonRpcClient({ 
        ajaxUrl: '/api/v1/socket', 
        socketUrl: 'wss://testnet.lyra.live/api/v1/socket',
        oncallback: function(resp) {
          if(resp.method == "Sign")
          {
            var signt = lyraSign(resp.params[0], pvk);
            return ["der", signt];
          }
          else
          {
            console.log("unsupported server call back method: " + resp.method);
            return null;
          }
        },
        onmessage: function(event) {
                console.log(`[message] Data received from server: ${event.data}`);
          var result = JSON.parse(event.data);
          if(result.method == "Notify") {
            unrecvlyr += result.params[0].funds.LYR;
            unrecv++; updurcv();            
          }
              },
        onopen: function(event) {
                console.log("wss open.");
              },
        onerror: function(event) {
                console.log("wss error.");
              }
      });
            foo.call('Status', [ '2.2', 'testnet' ], success_cb, error_cb);
      foo.call('Monitor', [ accountId ]);
      foo.call('Balance', [ accountId ], updbal, error_cb);
      console.log("wss created.");
  
        $("#Button1").click(function(){
            pvk = lyraGenWallet();
            puk = prvToPub(pvk);		
            $("#pvtkey").text(lyraEncPvt(pvk));
      accountId = lyraEncPub(puk);
            $("#pubkey").text(accountId);
      console.log(pvk);
      console.log(puk);
      console.log(accountId);
        });
    $("#Button2").click(function(){
      foo.call('Balance', [ accountId ], updbal, error_cb);
    });
        $("#Button4").click(function(){
      unrecv = 0; unrecvlyr = 0; updurcv();
      foo.call('Receive', [ accountId ], updbal, error_cb);
        });
  });*/
}

export default Lyratest;