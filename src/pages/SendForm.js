import React, { Component } from 'react';
import { Form, Input, Button, InputNumber, Select } from 'antd';
import "antd/dist/antd.css";

import persist from '../lyra/persist';

const { Option, OptGroup } = Select;

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

class Send extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      msg: ''
    };
    this.onFinish = this.onFinish.bind(this);
  }

  onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }

  async onFinish(values) {
    console.log("send token to: " + values.destaddr);

    var pdata = await persist.getData();

    var sf = this;
    // var client = new lyraClient();
    // await client.CallAsync("Send", 
    //   pdata.wallets[0].accountId,
    //   values.amount,
    //   values.destaddr,
    //   values.tokenname)
    // .then(result => {
    //   console.log("CallAsync success. " + result);
    //   sf.setState({msg: "Token send successfully. Your balance is " + result.balance.LYR});
    // })
    // .catch(error => { 
    //   console.log("CallAsync failed. " + error);
    //});
    // this.ws.call('Send', [ 
    //   this.state.accountId,
    //   e.amount,
    //   e.destaddr,
    //   e.tokenname
    // ], (resp) => this.lapp.updbal(resp), this.error_cb);
  }

  render() {
    return (
      <div>
        <Form
          {...layout}
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label="DestAddr"
            name="destaddr"
            rules={[
              {
                required: true,
                message: 'Please input destination address/account ID!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="TokenName"
            name="tokenname"
            rules={[
              {
                required: true,
                message: 'Please select token name you want to send!',
              },
            ]}
          >
            <Select style={{ width: 120 }}>
              <OptGroup label="Official">
                <Option value="LYR">LYR</Option>
              </OptGroup>
              <OptGroup label="Customized">
                <Option value="TST">Test</Option>
              </OptGroup>
            </Select>
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: 'Please input the amount you want to send!',
              },
            ]}
          >
            <InputNumber min={1} max={92233720368} />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </Form.Item>

        </Form>
        <h2>{this.state.msg}</h2>
      </div>
    );
  }
};

export default Send;