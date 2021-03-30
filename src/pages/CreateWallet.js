import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { connect } from 'react-redux';

import * as actionTypes from "./redux/actionTypes";

class CreateWalletForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            done: false
          };
        this.onFinish = this.onFinish.bind(this);
    }
    async onFinish(values) {
        console.log('Success:', values);

        this.props.dispatch({type: actionTypes.WALLET_CREATE, payload: {
            name: values.walletname,
            password: values.password
        }})

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
                <div>Create New Wallet</div>
                <Form
                    
                    name="basic"
                    initialValues={{
                        walletname: "default",
                    }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Form.Item
                        label="Name of the wallet"
                        name="walletname"
                    >
                        <Input placeholder="Wallet Name" disabled />
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

                    <Form.Item>
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

const mapStateToProps = state => {
    return {
        IsExists: state.existing,
        IsOpened: state.opening,
        Err: state.error
    };    
  }

const CreateWallet = connect(mapStateToProps)(CreateWalletForm);

export default CreateWallet;