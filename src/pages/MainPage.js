import React from 'react';
import { useSelector } from 'react-redux'
import { Link } from "react-router-dom";
import OpenWallet from './OpenWallet';
import { SettingsIcon } from '../lyra/icons';

import logo from '../logo.png';
import FrontForm from './FrontForm';

export default function MainPage() {
    const opening = useSelector(state => state.app.opening);

    if (!opening) {
        return <OpenWallet />
    }

    if (opening)
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