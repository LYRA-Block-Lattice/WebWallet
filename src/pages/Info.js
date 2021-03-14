import React, { Component } from 'react';
import { Button } from 'antd';
import "antd/dist/antd.css";

import LyraCrypto from '../lyra/crypto';
import persist from '../lyra/persist';

export default class Info extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            network: '',
            pub: '',
            pvt: '',
          };
          this.shwopvt = this.shwopvt.bind(this);
    }

    async componentDidMount() {
        const tokenString = sessionStorage.getItem('token');
        const token = JSON.parse(tokenString);

        var pdata = await persist.getData();
        this.setState({network: pdata.network});
        var wallets = pdata.wallets;
        var decData = LyraCrypto.decrypt(wallets[0].data, token);
        var pvk = LyraCrypto.lyraDec(decData);
        var pub = LyraCrypto.lyraEncPub(LyraCrypto.prvToPub(pvk));
        this.setState({pub: pub});
    }

    async shwopvt() {
        const tokenString = sessionStorage.getItem('token');
        const token = JSON.parse(tokenString);

        var pdata = await persist.getData();
        var wallets = pdata.wallets;
        var decData = LyraCrypto.decrypt(wallets[0].data, token);
        var pvk = LyraCrypto.lyraDec(decData);
        var pvtkey = LyraCrypto.lyraEncPvt(pvk);
        this.setState({pvt: pvtkey});
    }

    render() {
        // if (!token) {
        //     return <OpenWallet setToken={setToken} />
        // }
    
        if(this.state.pvt !== '')
            return (<div>
                <p>Your private key is:</p>
                <pre>{this.state.pvt}</pre>
                <p>Please save it properly.</p>
            </div>);

        return (            
            <div>
                <h2>Information about your wallet</h2>
                <p>Your wallet address is:</p>
                <pre>{this.state.pub}</pre>
                <p>Current connected blockchain:</p>
                <pre>{this.state.network}</pre>
                <Button type="link" onClick={this.shwopvt}>Show my private key</Button>
                <Button type="link" onClick={this.shwopvt}>Show my private key</Button>
            </div>
            
        );
    }

}