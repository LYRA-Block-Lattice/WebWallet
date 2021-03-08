import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Form, Input, Button, InputNumber, Select } from 'antd';
import "antd/dist/antd.css";

const { Option } = Select;

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

class Preference extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          closed: false
        };
        this.onFinish = this.onFinish.bind(this);
      }

    onFinish(values) {
        sessionStorage.setItem('token', null);
        this.setState({closed: true});
    }

    render() {
        if(this.state.closed) {
            return <Redirect to="/" />;
        }

        return (
            <div>
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={this.onFinish}
                >

                    <Form.Item
                        label="Blockchain Name"
                        name="blockchainname"
                    >
                        <Select style={{ width: 220 }} defaultValue="testnet">
                            <Option value="mainnet">MainNet</Option>
                            <Option value="testnet">TestNet</Option>
                            <Option value="devnet">DevNet (Dev only)</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Close Wallet
                        </Button>
                    </Form.Item>

                </Form>
            </div>
        );
    }
};

export default Preference;