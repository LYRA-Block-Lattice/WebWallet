import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import "antd/dist/antd.css";
class InfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            pvt: null
          };
        this.shwopvt = this.shwopvt.bind(this);
    }

    async shwopvt() {
        const userToken = JSON.parse(sessionStorage.getItem('token'));
        this.setState({pvt: userToken.pvt});
    }

    render() {
        // if (!token) {
        //     return <OpenWallet setToken={setToken} />
        // }
    
        if(this.state.pvt !== null)
            return (<div>
                <p>Your private key is:</p>
                <pre>{this.state.pvt}</pre>
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
    return {
        pub: state.app.wallet.accountId,
        network: state.app.wallet.network,
    };
}

const Info = connect(mapStateToProps)(InfoForm);
export default Info;