import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import persist from '../lyra/persist';

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

export default class OpenWallet extends Component {
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

        await persist.setData(wds);

        this.props.setToken(values.password);
    }

    onFinishFailed(errorInfo) {
        console.log('Failed:', errorInfo);
    }

    render() {
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
                            Restore by Private Key
                      </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

}