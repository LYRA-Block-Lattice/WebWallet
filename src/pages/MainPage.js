import React from 'react';
import useToken from './useToken';
import { Button } from 'antd';
import { Redirect } from 'react-router-dom';

export default function MainPage() {
    const { token, setToken } = useToken();

    if(token)
        return(
            <div>
                <h2>The wallet's main page.</h2>
                <Button type="primary" onClick={e => setToken(null)} >Close Wallet in main {token}</Button>
            </div>
        );
    else
        return <Redirect to="/"></Redirect>;
}