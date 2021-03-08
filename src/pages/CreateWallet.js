import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import localforage from 'localforage';

import LyraCrypto from '../lyra/crypto';

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

export default class CreateWallet extends Component {
    constructor(props) {
        super(props);
        this.onFinish = this.onFinish.bind(this);
    }
    async onFinish(values) {
        console.log('Success:', values);

        var lc = new LyraCrypto();
        //var pvt = lc.lyraDec(values.pvtkey);
        //var actId = lc.lyraEncPub(lc.prvToPub(pvt));

        var encData = lc.encrypt(values.pvtkey, values.password);

        var wds = [{ name: 'default', data: encData }];

        await localforage.setItem('rxstor', JSON.stringify(wds));

        this.props.setToken(values.password);
    }

    onFinishFailed(errorInfo) {
        console.log('Failed:', errorInfo);
    }

    render() {
        return (
            <div>
                <div {...layout}>Create New Wallet</div>
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
                        label="Name of the wallet"
                        name="walletname"
                        rules={[{ required: true, message: 'Please give the wallet a name.' }]}
                    >
                        <Input placeholder="Wallet Name" />
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
                            Create a Wallet
                      </Button>
                    </Form.Item>
                </Form>

                <p><Link to="/restore">Have a Private Key? Restore it.</Link></p>

            </div>
        );
    }

}