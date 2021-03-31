import React from 'react';
import { useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom';
import { SettingsIcon } from '../lyra/icons';

import FrontForm from './FrontForm';

export default function MainPage() {
    const opening = useSelector(state => state.app.opening);

    if (!opening) {
        return <Redirect to="/open" />;
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
                    <FrontForm></FrontForm>
                </div>
            </div>
        );
}