import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { subscribe } from 'redux-subscriber';
import { Form, Input, Button, InputNumber, Select, message } from 'antd';
//import "antd/dist/antd.css";
import QrReader from 'react-qr-reader';

import * as actionTypes from './redux/actionTypes';

const { Option, OptGroup } = Select;

class SendForm extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      scan: false,
      result: '',
      msg: '',
      tag: null,
      unsub: null
    };
    this.onFinish = this.onFinish.bind(this);
    this.scanpage = this.scanpage.bind(this);
  }

  handleScan = data => {
    if (data) {
      this.setState({
        result: data
      })
    }
  }
  handleError = err => {
    console.error(err)
  }

  onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }

  scanpage(enabled) {
    this.setState({scan: enabled});
  }

  async onFinish(values) {
    console.log("send token to: " + values.destaddr);

    this.setState({tag: '_' + Math.random().toString(36).substr(2, 9)});
    this.props.dispatch({type: actionTypes.WALLET_SEND, payload: {
      accountId: this.props.accountId,
      destaddr: values.destaddr,
      tokenname: values.tokenname,
      amount: values.amount,
      tag: this.state.tag
    }});
  }

  componentDidMount() {
    if(typeof this.state.unsub === 'function')
      this.state.unsub();

    const unsub = subscribe('app.tx', store => {
      if(store.app.tx.tag === this.state.tag)
      {
        switch(store.app.tx.result) {
          case "pending":
            message.info('Sending transaction request...');
            break;
          case "success":
            message.success('Send Token Success.');
            break;
          case "failed":
            message.error('Send Token failed: ' + store.app.error.error.message, 5);
            break;
          default:
            break;
        }
      }
    });

    this.setState({unsub: unsub});
  }

  componentWillUnmount () {
    if(typeof this.state.unsub === 'function')
      this.state.unsub();
  }

  render() {

    if (!this.props.opening) {
      return <Redirect to="/open" />;
    }

    if(this.state.scan) {
      return (
        <div>
          <QrReader
            delay={300}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: '100%' }}
          />
          <p className="laddr">{this.state.result}</p>
          <p><Button type="link" onClick={this.scanpage.bind(this, false)}>OK</Button></p>
          <p><Button type="link" onClick={this.scanpage.bind(this, false)}>Cancel</Button></p>         
          
        </div>
      )
    }

    return (
      <div>
        <div>
          <h2>Will Send from my account:</h2>
          <p className="laddr">{this.props.accountId}</p>
          <h3>Current Balance:</h3>
          <p>{this.props.balance} LYR</p>
          <h2>To:</h2>
        </div>
        <Form
          
          name="basic"
          initialValues={{
            remember: true,
            destaddr: this.state.result
          }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label="Target Account ID"
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
          <Button type="link" onClick={this.scanpage.bind(this, true)}>Scan QRCode for Wallet Address</Button>
 
         <Form.Item
            label="Token Name"
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

          <Form.Item>
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

const mapStateToProps = state => {
  return {
    opening: state.app.opening,
    balance: state.app.wallet.balance,
    accountId: state.app.wallet.accountId,
    network: state.app.network,
  };
}

const Send = connect(mapStateToProps)(SendForm);
export default Send;