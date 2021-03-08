import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Button, Select } from 'antd';
import "antd/dist/antd.css";

import persist from '../lyra/persist';

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
          closed: false,
          network: ''
        };
        this.onFinish = this.onFinish.bind(this);
        this.handleChange = this.handleChange.bind(this);
      }
    
    async componentDidMount() {
        var pdata = await persist.getData();
        this.setState({network: pdata.network});
    }

    onFinish(values) {
        sessionStorage.setItem('token', null);
        this.setState({closed: true});
    }

    async handleChange(value) {
        console.log(value); 

        var pdata = await persist.getData();
        pdata.network = value;
        await persist.setData(pdata);
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
                        network: true,
                    }}
                    fields={[
                        {
                          name: ["network"],
                          value: this.state.network,
                        },
                      ]}
                    onFinish={this.onFinish}
                >

                    <Form.Item
                        label="Blockchain Name"
                        name="network"
                    >
                        <Select style={{ width: 220 }}
                            onChange={this.handleChange}
                        >
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