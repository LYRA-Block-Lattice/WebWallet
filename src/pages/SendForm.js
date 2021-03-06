import React, { Component } from 'react';
import { Form, Input, Button, InputNumber, Select } from 'antd';
import "antd/dist/antd.css";

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
  onFinish(values) {
    console.log('Success:', values);
    this.props.func(values);
  }

  onFinishFailed(errorInfo){
    console.log('Failed:', errorInfo);
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
          onFinish={this.props.func}
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
            <InputNumber min={1} max={92233720368}/>
          </Form.Item>
    
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </Form.Item>
          
        </Form>
        </div>
      );
  }
};

export default Send;