import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button } from 'antd';

import * as actionTypes from './redux/actionTypes';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

class RestoreWallet extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            done: false
          };
    }

    onFinish = (values) => 
    {
        console.log('Success:', values);

        this.props.dispatch({type: actionTypes.WALLET_RESTORE, payload: {
            name: "default",
            privateKey: values.pvtkey,
            password: values.password
        }});

        // var pvt = LyraCrypto.lyraDec(values.pvtkey);
        // var actId = LyraCrypto.lyraEncPub(LyraCrypto.prvToPub(pvt));
        // var encData = LyraCrypto.encrypt(values.pvtkey, values.password);

        // var wds = { network: 'testnet', wallets: [{ 
        //     name: 'default', 
        //     accountId: actId, 
        //     data: encData
        // }]};

        // await persist.setData(wds);

        // use redirect to open wallet
        this.setState({done: true});
    }

    onFinishFailed(errorInfo) {
        console.log('Failed:', errorInfo);
    }

    render() {
        if(this.state.done) {
            return <Redirect to="/" />;
        }

        return (
            <div>
                <div {...layout}>Use this for test: eSAErSXn2djzLgWFxd8vtFfnmgrUAhEntHCgKFwTPi8AY3hnG</div>
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Form.Item
                        label="Private Key"
                        name="pvtkey"
                        rules={[{ required: true, message: 'Please input your private key.' }]}
                    >
                        <Input placeholder="Private Key" />
                    </Form.Item>
                    
                    <Form.Item
                        label="Name of the wallet"
                        name="walletname"
                    >
                        <Input placeholder="Wallet Name" defaultValue="default" disabled/>
                    </Form.Item>

                    <Form.Item
                        label="Set a Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password.' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Repeat Password"
                        name="password2"
                        rules={[{ required: true, message: 'Please confirm your password.' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Restore by Private Key
                      </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

}

export default connect()(RestoreWallet);