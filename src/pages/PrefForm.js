import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Select } from 'antd';
//import "antd/dist/antd.css";

import * as actionTypes from './redux/actionTypes';

const { Option } = Select;

const mapStateToProps = state => {
    return {
      network: state.app.network,
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
        this.forceSWupdate = this.forceSWupdate.bind(this);
      }
    
    onFinish(values) {
        this.setState({closed: true});
        this.props.dispatch({type: actionTypes.WALLET_CLOSE});
    }

    async handleChange(value) {
        console.log(value); 

        this.props.dispatch({type: actionTypes.WALLET_CHANGE_NETWORK, payload: {network: value}});
    }

    forceSWupdate () {
        if ('serviceWorker' in navigator) {
            console.log("refresh service registration.");
          navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (let registration of registrations) {
              registration.update()
            }
          })
        }
        else
        {
            console.log("no service registration.");
        }
      }

    render() {
        // if(this.state.closed) {
        //     return <Redirect to="/" />;
        // }

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

                <Button type="link" onClick={this.forceSWupdate}>Refresh App</Button>
            </div>
        );
    }
};

const Preference = connect(mapStateToProps)(PreferenceForm);

export default Preference;