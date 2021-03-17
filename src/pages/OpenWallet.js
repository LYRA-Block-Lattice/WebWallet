import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Select, message } from "antd";
import "antd/dist/antd.css";
import "./OpenWallet.css";

import LyraCrypto from "../lyra/crypto";
import persist from "../lyra/persist";

const { Option } = Select;

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16
  }
};

const error = () => {
  message.error("Wrong password!");
};

export default class OpenWallet extends Component {
  constructor(props) {
    super(props);
    this.onFinish = this.onFinish.bind(this);
  }
  async onFinish(values) {
    console.log("Success:", values);

    try {
      var pdata = await persist.getData();
      var wallets = pdata.wallets;
      var decData = LyraCrypto.decrypt(wallets[0].data, values.password);
      var pvk = LyraCrypto.lyraDec(decData);

      if (pvk === undefined) {
        error();
      } else {
        this.props.setToken(values.password);
      }
    } catch (err) {
      console.log(err);
      error();
    }
  }

  onFinishFailed(errorInfo) {
    console.log("Failed:", errorInfo);
  }

  render() {
    return (
      <div className="openWalletWrapper">
        <div className="openWallet">
          <Form
            className="openWallet__form"
            {...layout}
            name="basic"
            initialValues={{
              remember: true
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item label="Wallet Name" name="walletname">
              <Select style={{ width: 120 }} defaultValue="default">
                <Option value="default">Default</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password." }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Open Wallet
              </Button>
            </Form.Item>
          </Form>

          <div className="openWallet__footer">
            <Link to="/create">Create New Wallet</Link>
          </div>
          <div className="openWallet__footer">
            <Link to="/restore">Restore by Private Key</Link>
          </div>
        </div>
      </div>
    );
  }
}
