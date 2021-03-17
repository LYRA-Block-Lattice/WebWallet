import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Form, Input, Button } from "antd";
import persist from "../lyra/persist";

import LyraCrypto from "../lyra/crypto";
import "./createWallet.css";

const layout = {
  labelCol: {
    span: 10
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

export default class CreateWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false
    };
    this.onFinish = this.onFinish.bind(this);
  }
  async onFinish(values) {
    console.log("Success:", values);

    //var pvt = LyraCrypto.lyraDec(values.pvtkey);
    //var actId = LyraCrypto.lyraEncPub(LyraCrypto.prvToPub(pvt));

    var pvtHex = LyraCrypto.lyraGenWallet();
    var prvKey = LyraCrypto.lyraEncPvt(pvtHex);
    var actId = LyraCrypto.lyraEncPub(LyraCrypto.prvToPub(pvtHex));
    var encData = LyraCrypto.encrypt(prvKey, values.password);

    var wds = {
      network: "testnet",
      wallets: [
        {
          name: "default",
          accountId: actId,
          data: encData
        }
      ]
    };

    await persist.setData(wds);

    this.setState({ done: true });
  }

  onFinishFailed(errorInfo) {
    console.log("Failed:", errorInfo);
  }

  render() {
    if (this.state.done) {
      return <Redirect to="/" />;
    }

    return (
      <div className="wrapperClass">
        <div className="createWallet">
          <div className="createWallet__name" {...layout}>
            Create New Wallet
          </div>
          <Form
            className="createWallet__form"
            {...layout}
            name="basic"
            initialValues={{
              remember: true
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item label="Name of the wallet" name="walletname">
              <Input
                placeholder="Wallet Name"
                defaultValue="default"
                disabled
              />
            </Form.Item>

            <Form.Item
              label="Set a Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password." }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Repeat Password"
              name="password2"
              rules={[
                { required: true, message: "Please confirm your password." }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button
                type="primary"
                htmlType="submit"
                className="createWallet__button"
              >
                Create a Wallet
              </Button>
            </Form.Item>
          </Form>

          <p>
            <Link to="/restore">Have a Private Key? Restore it.</Link>
          </p>
        </div>
      </div>
    );
  }
}
