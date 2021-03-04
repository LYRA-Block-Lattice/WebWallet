import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import useToken from './useToken';
import { Button } from 'antd';
import OpenWallet from './OpenWallet';

export default function MainPage() {
    const { token, setToken } = useToken();

    if(!token) {
        return <OpenWallet setToken={setToken} />
    }

    if(token)
        return(
            <div>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/info">About Your Wallet</Link>
                    </li>
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                </ul>
                <h2>The wallet's main page.</h2>
                <Button type="primary" onClick={e => setToken(null)} >Close Wallet in main {token}</Button>
            </div>
        );
}