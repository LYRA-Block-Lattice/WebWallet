import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Form, Button, Select } from 'antd';
import "antd/dist/antd.css";

import store from './redux/store';
import * as actionTypes from './redux/actionTypes';

const { Option } = Select;

const mapStateToProps = state => {
    return {
      network: state.network,
    };
  }

class PreferenceForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          closed: false,
          network: ''
        };
        this.onFinish = this.onFinish.bind(this);
        this.handleChange = this.handleChange.bind(this);
      }
    
    onFinish(values) {
        this.setState({closed: true});
        store.dispatch({type: actionTypes.WALLET_CLOSE});
    }

    async handleChange(value) {
        console.log(value); 

        store.dispatch({type: actionTypes.WALLET_CHANGE_NETWORK, payload: {network: value}});
    }

    render() {
        if(this.state.closed) {
            return <Redirect to="/" />;
        }

        return (
            <div>
                <Form                    
                    name="basic"
                    initialValues={{
                        remember: true,
                        network: true,
                    }}
                    fields={[
                        {
                          name: ["network"],
                          value: this.props.network,
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

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Close Wallet
                        </Button>
                    </Form.Item>

                </Form>
            </div>
        );
    }
};

const Preference = connect(mapStateToProps)(PreferenceForm);

export default Preference;