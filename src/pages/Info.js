import React, { Component } from 'react';
import LyraCrypto from '../lyra/crypto';
import persist from '../lyra/persist';

export default class Info extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            network: '',
            pub: ''
          };
    }

    async componentDidMount() {
        const tokenString = sessionStorage.getItem('token');
        const token = JSON.parse(tokenString);

        var lc = new LyraCrypto();
        var pdata = await persist.getData();
        this.setState({network: pdata.network});
        var wallets = pdata.wallets;
        var decData = lc.decrypt(wallets[0].data, token);
        var pvk = lc.lyraDec(decData);
        var pub = lc.lyraEncPub(lc.prvToPub(pvk));
        this.setState({pub: pub});
    }

    render() {
        // if (!token) {
        //     return <OpenWallet setToken={setToken} />
        // }
    
        return (
            <div>
                <h2>Information about your wallet</h2>
                <p>Your wallet address is:</p>
                <pre>{this.state.pub}</pre>
                <p>Current connected blockchain:</p>
                <pre>{this.state.network}</pre>
            </div>
            
        );
    }

}