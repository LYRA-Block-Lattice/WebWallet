import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Button } from "antd";

import * as actionTypes from "../redux/actionTypes";

class RestoreWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false,
    };
  }

  onFinish = (values) => {
    console.log("Success:", values);

    this.props.dispatch({
      type: actionTypes.WALLET_RESTORE,
      payload: {
        name: "default",
        privateKey: values.pvtkey,
        password: values.password,
      },
    });

    this.setState({ done: true });
  };

  onFinishFailed(errorInfo) {
    console.log("Failed:", errorInfo);
  }

  render() {
    return (
      <div>
        <div>Always keep the private key safely.</div>
        <Form
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
            rules={[
              { required: true, message: "Please input your private key." },
            ]}
          >
            <Input placeholder="Private Key" />
          </Form.Item>

          <Form.Item label="Name of the wallet" name="walletname">
            <Input placeholder="Wallet Name" defaultValue="default" disabled />
          </Form.Item>

          <Form.Item
            label="Set a Password"
            name="password"
            rules={[{ required: true, message: "Please input your password." }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Repeat Password"
            name="password2"
            rules={[
              { required: true, message: "Please confirm your password." },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Restore by Private Key
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default connect()(RestoreWallet);
