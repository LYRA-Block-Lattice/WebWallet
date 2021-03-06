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

const getAppVersion = () => {
    const url = `/version.json?c=${Date.now()}`
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }

    return fetch(url, { headers }).then(response => response.json())
  }
class PreferenceForm extends Component {

    constructor(props) {
        super(props);
        this.state = { 
          closed: false,
          network: '',
          version: ''
        };
        this.onFinish = this.onFinish.bind(this);
        this.handleChange = this.handleChange.bind(this); 
      }
    
    onFinish(values) {
        this.setState({closed: true});
        this.props.dispatch({type: actionTypes.WALLET_CLOSE});
    }

    async handleChange(value) {
        console.log(value); 

        this.props.dispatch({type: actionTypes.WALLET_CHANGE_NETWORK, payload: {network: value}});
    }

    componentDidMount() {
        getAppVersion()
        .then((data) => {
          this.setState({version: data.version});
        })
        .catch(err => {
          console.log("error get version", err);
        });
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

                <br/><br/><br/><br/><br/><br/>
                <div><i>Lyra PWA Version: {this.state.version}</i></div>
            </div>
        );
    }
};

const Preference = connect(mapStateToProps)(PreferenceForm);

export default Preference;