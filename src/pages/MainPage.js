import React from 'react';
import useToken from './useToken';
import OpenWallet from './OpenWallet';
import { SettingsIcon } from '../lyra/icons';

//import 'antd/dist/antd.css';
import { Menu, Dropdown } from 'antd';

import logo from '../logo.png';
import Lyratest from '../lyra/Lyratest';

export default function MainPage() {
    const { token, setToken } = useToken();

    const menu = (
        <Menu>
            {/* <Menu.Item key="0">
          <a href="https://www.antgroup.com">1st menu item</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="https://www.aliyun.com">2nd menu item</a>
        </Menu.Item>
        <Menu.Divider /> */}
            <Menu.Item key="3" onClick={e => setToken(null)}>Close Wallet</Menu.Item>
        </Menu>
    );

    if (!token) {
        return <OpenWallet setToken={setToken} />
    }

    if (token)
        return (
            <div className="wrapper">
                <div style={{ position: 'absolute', top: '0px', right: '0px' }}>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <SettingsIcon onClick={e => e.preventDefault()}></SettingsIcon>
                    </Dropdown>
                </div>
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <br /><br />
                        <Lyratest></Lyratest>
                    </header>
                </div>
            </div>
        );
}