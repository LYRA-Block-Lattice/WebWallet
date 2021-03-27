import persist from './persist';
import JsonRpcClient from './jsonrpcclient';
import LyraCrypto from './crypto';

class lyraClient {
    success_cb(data) {
        console.log("success cb");
        console.log(data);
      }
    error_cb(data) {
        console.log("error cb: ");
        console.log(data);
    }

    CallAsync(method, ...params) {
        this.lc = this;
        console.log("in call: method is " + method + " params is " + params);
        return new Promise(async function (success, failed) {
            var pdata = await persist.getData();

            var url = 'wss://testnet.lyra.live/api/v1/socket';
            if (pdata.network === 'mainnet')
                url = 'wss://mainnet.lyra.live/api/v1/socket';
            if (pdata.network === 'devnet')
                url = 'wss://localhost:4504/api/v1/socket';

            var ws = new JsonRpcClient({
                socketUrl: url,
                oncallback: async (resp) => {
                    if (resp.method === "Sign") {
                        console.log("Signing " + resp.params[0] + " of " + resp.params[1]);

                        const tokenString = sessionStorage.getItem('token');
                        const userToken = JSON.parse(tokenString);
                        var pdata = await persist.getData();
                        var wallets = pdata.wallets;
                        var decData = LyraCrypto.decrypt(wallets[0].data, userToken);
                        var pvk = LyraCrypto.lyraDec(decData);

                        var signt = LyraCrypto.lyraSign(resp.params[1], pvk);
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
                    console.log(new Date().toUTCString() + ' wss open.');
                    //console.log("calling method " + method + " with params " + params);                    
                },
                onclose: () => {
                    console.log("wss close.");
                    // lol force reopen
                    //ws.call('Status', ['2.2', 'devnet'], success, failed);
                },
                onerror: function (event) {
                    console.log("wss error.");
                    failed(event);
                }
            });

            ws.call(method, params, success, failed);
            //ws.call('Status', ['2.2', 'devnet'], success, failed);
        });
    }
}

export default lyraClient;