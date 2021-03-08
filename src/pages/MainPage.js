import React from 'react';
import { Link } from "react-router-dom";
import useToken from './useToken';
import OpenWallet from './OpenWallet';
import { SettingsIcon } from '../lyra/icons';

import logo from '../logo.png';
import FrontForm from './FrontForm';

export default function MainPage() {
    const { token, setToken } = useToken();

    if (!token) {
        return <OpenWallet setToken={setToken} />
    }

    if (token)
        return (
            <div className="wrapper">
                <div style={{ position: 'absolute', top: '0px', right: '0px' }}>
                <Link to="/pref">
                    <SettingsIcon />
                </Link>
                </div>
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <br /><br />
                        <FrontForm></FrontForm>
                    </header>
                </div>
            </div>
        );
}