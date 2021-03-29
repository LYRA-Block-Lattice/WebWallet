import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import "antd/dist/antd.css";

import LyraCrypto from '../lyra/crypto';
import persist from '../lyra/persist';

class InfoForm extends Component {
    constructor(props) {
        super(props);
        this.shwopvt = this.shwopvt.bind(this);
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
    
        if(this.props.pvt !== null)
            return (<div>
                <p>Your private key is:</p>
                <pre>{this.props.pvt}</pre>
                <p>Please save it properly.</p>
            </div>);

        return (            
            <div>
                <h2>Information about your wallet</h2>
                <p>Your wallet address is:</p>
                <pre>{this.props.pub}</pre>
                <p>Current connected blockchain:</p>
                <pre>{this.props.network}</pre>
                <Button type="link" onClick={this.shwopvt}>Show my private key</Button>
            </div>
            
        );
    }
}

const mapStateToProps = state => {
    console.log("state is", state);
    return {
        pub: state.wallet.accountId,
        pvt: state.wallet.accountId,
        network: state.wallet.accountId,
    };
}

const Info = connect(mapStateToProps)(InfoForm);
export default Info;