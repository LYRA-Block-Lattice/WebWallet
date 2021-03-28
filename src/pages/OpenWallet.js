import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Select, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";

import LyraCrypto from '../lyra/crypto';
import persist from '../lyra/persist';
import { connect } from 'react-redux';

const { confirm } = Modal;

const { Option } = Select;

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

const error = () => {
    message.error('Wrong password!');
  };

class OpenWalletPage extends Component {
    constructor(props) {
        super(props);
        this.onFinish = this.onFinish.bind(this);
        this.removeWallet = this.removeWallet.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
    }

    async componentDidMount() {

    }

    async onFinish(values) {
        console.log('Success:', values);

        try {
            var pdata = await persist.getData();
            var wallets = pdata.wallets;
            var decData = LyraCrypto.decrypt(wallets[0].data, values.password);
            var pvk = LyraCrypto.lyraDec(decData);
    
            if(pvk === undefined) {
                error();
            }
            else {
                this.props.setToken(values.password);
            }   
        } catch (err) {
            console.log(err);
            error();
        }         
    }

    showConfirm() {
        const fm = this;
        confirm({
          title: 'Do you Want to delete wallet?',
          icon: <ExclamationCircleOutlined />,
          content: 'The wallet can\'t be recovered if not backup first.',
          onOk() {
            console.log('Yes');
            fm.removeWallet();
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }

    removeWallet() {
        persist.removeData();
        this.setState({ exists: false });
    }

    onFinishFailed(errorInfo) {
        console.log('Failed:', errorInfo);
    }

    OpenWalletForm = () => (
        <Form
        {...layout}
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

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    Open Wallet
            </Button>
            </Form.Item>
        </Form>
    )

    render() {
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
        IsExists: state.existing
    };    
  }

const OpenWallet = connect(mapStateToProps)(OpenWalletPage);

export default OpenWallet;