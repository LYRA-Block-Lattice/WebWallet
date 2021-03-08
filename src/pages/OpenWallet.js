import React, { Component } from 'react';
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

        await localforage.setItem('rxstor', JSON.stringify(wds));
        //.then(function (value) {
            // Do other things once the value has been saved.
            //console.log("save ok " + value);

            // localforage.getItem('rxstor').then(function(value) {
            //     // This code runs once the value has been loaded
            //     // from the offline store.
            //     console.log(value);

            //     var decData = lc.decrypt(encData, values.password);
            // }).catch(function(err) {
            //     // This code runs if there were any errors
            //     console.log(err);
            // });   

        // }).catch(function(err) {
        //     // This code runs if there were any errors
        //     console.log("save fail " + err);
        // });

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
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Create Wallet
                      </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

}