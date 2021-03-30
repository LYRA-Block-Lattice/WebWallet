import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, Input, Button, Select, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";

import { connect } from 'react-redux';
import * as actionTypes from './redux/actionTypes';

const { confirm } = Modal;

const { Option } = Select;

const passwordAlert = () => {
    message.error('Wrong password!');
  };

class OpenWalletPage extends Component {
    constructor(props) {
        super(props);
        this.onFinish = this.onFinish.bind(this);
        this.removeWallet = this.removeWallet.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
    }

    componentDidUpdate(prevProps){
        if(this.props.Err !== null) { passwordAlert(); }
     }

    async onFinish(values) {
        console.log('Success:', values);

        this.props.dispatch({type: actionTypes.WALLET_OPEN, payload: {
            name: "default",
            password: values.password
        }});   
    }

    showConfirm() {
        const fm = this;
        confirm({
          title: 'Do you Want to delete wallet?',
          icon: <ExclamationCircleOutlined />,
          content: 'The wallet can\'t be recovered if not backup first.',
          onOk() {
            console.log('Yes');
            fm.removeWallet("default");
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }

    removeWallet(name) {
        this.props.dispatch({type: actionTypes.WALLET_REMOVE, payload: name})
        this.setState({ exists: false });
    }

    onFinishFailed(errorInfo) {
        console.log('Failed:', errorInfo);
    }

    OpenWalletForm = () => (
        <Form
        
        name="basic"
        initialValues={{
            remember: true,
            walletname: "default"
        }}
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFailed}
        >
            <Form.Item
                label="Wallet Name"
                name="walletname"
            >
                <Select style={{ width: 120 }}>
                    <Option value="default">Default</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password.' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Open Wallet
            </Button>
            </Form.Item>
        </Form>
    )

    render() {
        if(this.props.IsOpened) {
            return <Redirect to="/" />;
        }

        return (
            <div>
                { this.props.IsExists ? <this.OpenWalletForm /> : null }

                <p><Link to="/create">Create New Wallet</Link></p>
                <p><Link to="/restore">Restore by Private Key</Link></p> 

                { this.props.IsExists ? <p><Button type="link" onClick={this.showConfirm}>Remove Wallet</Button></p> : null }
                   
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log("state is", state);
    return {
        IsExists: state.existing,
        IsOpened: state.opening,
        Err: state.error
    };    
  }

const OpenWallet = connect(mapStateToProps)(OpenWalletPage);

export default OpenWallet;