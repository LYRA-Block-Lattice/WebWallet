import React, { useState } from 'react';
import './App.less';
import { Button } from 'antd';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import OpenWallet from './pages/OpenWallet';
import MainPage from './pages/MainPage';
import Info from './pages/Info';
import useToken from './pages/useToken';

import logo from './logo.png';
import Lyratest from './lyra/Lyratest';
import { SettingsIcon } from './lyra/icons';


import 'antd/dist/antd.css';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const menu = (
  <Menu>
    {/* <Menu.Item key="0">
      <a href="https://www.antgroup.com">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="https://www.aliyun.com">2nd menu item</a>
    </Menu.Item>
    <Menu.Divider /> */}
    <Menu.Item key="3">An unfinished menu item</Menu.Item>
  </Menu>
);

function App() {
return (
  <div className="wrapper">
    <BrowserRouter>
      <Switch>
        <Route path="/info">
          <Info />
        </Route>
        <Route path="/">
          <MainPage />
        </Route>
      </Switch>
    </BrowserRouter>
  </div>
  );
}
  // return (
  //   <div>
  //     <div style={{ position: 'absolute', top: '0px', right: '0px' }}>
  //     <Dropdown overlay={menu} trigger={['click']}>
  //        <SettingsIcon onClick={e => e.preventDefault()}></SettingsIcon>
  //     </Dropdown>
        
  //       </div>
  //     <div className="App">
  //       <header className="App-header">
  //         <img src={logo} className="App-logo" alt="logo" />
  //         <br /><br />
  //         <Lyratest></Lyratest>
  //       </header>
  //     </div>
  //   </div>
  // );
//}

export default App;
