import React, { Component } from 'react';
import LyraCrypto from './lyracrypto';

class Lyratest extends Component {
  constructor() {
    super();
    this.state = { color: "red" };
    this.unrecv = 0;
    this.unrecvlyr = 0;

    console.log("lyra app started.");

    this.pvk = "54ff7b8aa7730b5fb41676f55c721967a2dd553678a40b856b580db9f946cda7";
    this.puk = "046f8815c5e79ba81f1cc9e4f8a311c70d8fa55e9792bd0d682e8a7ac157f28187b31edf7555b7b60ca6623150e7dd19d23d1d9ac2fc64d89a73bb2386247f2082";
    this.accountId = "LFbJq1N4fSdSLudWWACgYfpwKfpLrekT6ECR6knCX2br66wydpNpbFywoT6FrSwvoVSrb8zPzrcrFG4K7q7i8UVFKtkfnN";

    this.lc = new LyraCrypto();

    var aid = this.lc.lyraEncPub(this.puk);
    console.log("pub account id is " + aid);
    require('assert').equal(aid, this.accountId);
    this.start(this);
  }
  render() {
    return <h2>I am a Car!</h2>;
  }

  lc;

  pvk;
  puk;
  accountId;
  foo;
  unrecv;
  unrecvlyr;

  start(lapp) {
    var WebSocket = require('rpc-websockets').Client

    // instantiate Client and connect to an RPC server
    //var ws = new WebSocket('wss://192.168.3.62:4504/api/v1/socket');
    var ws = new WebSocket('wss://testnet.lyra.live/api/v1/socket');

    ws.on('open', function () {
      console.log("ws open");
      // call an RPC method with parameters
      ws.call('Status', [ '2.2', 'testnet' ]).then(function (result) {
        console.log("ws status got reply");
        //require('assert').equal(result, 8)
      })

      ws.call('Balance', [ lapp.accountId ] ).then(function (result) {
        console.log("ws Balance got reply");
        lapp.updbal(result);
        //require('assert').equal(result, 8)
      }).catch(err => {
        console.log("ws balance error");
        console.log(err);
      });

      // // send a notification to an RPC server
      // ws.notify('openedNewsModule')

      // // subscribe to receive an event
      // ws.subscribe('feedUpdated')

      // ws.on('Sign', function (resp) {
      //     var signt = this.lc.lyraSign(resp.params[1], this.pvk);
      //     return ["der", signt];
      // })

      // // unsubscribe from an event
      // ws.unsubscribe('feedUpdated')

      // // login your client to be able to use protected methods
      // ws.login({ 'username': 'confi1', 'password': 'foobar' }).then(function () {
      //   ws.call('account').then(function (result) {
      //     require('assert').equal(result, ['confi1', 'confi2'])
      //   })
      // }).catch(function (error) {
      //   console.log('auth failed')
      // })

      // close a websocket connection
      //ws.close()
    })
  }

  updbal(resp) {
    //$("#bala").text(resp.balance.LYR);
    if (resp.unreceived && this.unrecv === 0) {
      this.unrecv++;
      this.updurcv();
    }
  }
  updurcv() {
    // if(unrecv == 0)
    // {
    //   $('#xp').css("display", "none");
    //   $("#unrecv").text("");
    // }      
    // else {
    //   $("#uncnt").text(unrecvlyr == 0 ? '?' : unrecvlyr.toString());
    //   $("#xp").show();
    //   if(unrecvlyr == 0)
    //     $("#unrecv").text('?');
    //   else
    //     $("#unrecv").text(unrecv);
    // }      
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