import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import "antd/dist/antd.css";
import QRCode from 'qrcode.react';

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
                <p>Scan to pay me:</p>
                <QRCode value={this.props.pub}
                    size={256}
                    imageSettings={{
                        src: "/images/logo3.png",
                        x: null,
                        y: null,
                        height: 48,
                        width: 48,
                        excavate: true,
                    }}
                />
                <p>My wallet address is:</p>
                <p className="laddr">{this.props.pub}</p>
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
        network: state.app.network,
    };
}

const Info = connect(mapStateToProps)(InfoForm);
export default Info;