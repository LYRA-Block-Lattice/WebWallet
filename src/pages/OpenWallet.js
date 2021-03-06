import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';

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
    constructor(props){
        super(props);        
        this.onFinish = this.onFinish.bind(this);
    }
    onFinish(values) {
        console.log('Success:', values);
        this.props.setToken(values.pvtkey);
    }

    onFinishFailed(errorInfo) {
        console.log('Failed:', errorInfo);
    }

    render() {
        return (
            <Form
                {...layout}
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
            >
                <div>Use this for test: eSAErSXn2djzLgWFxd8vtFfnmgrUAhEntHCgKFwTPi8AY3hnG</div>
                <Form.Item
                    label="Private Key"
                    name="pvtkey"
                    rules={[{ required: true, message: 'Please input your private key.' }]}
                >
                    <Input placeholder="Private Key" />
                </Form.Item>


                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                </Form.Item>
            </Form>
        );
    }

}