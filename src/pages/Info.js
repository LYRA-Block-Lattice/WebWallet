import React from 'react';
import useToken from './useToken';
import OpenWallet from './OpenWallet';

export default function Info() {
    const { token, setToken } = useToken();

    if (!token) {
        return <OpenWallet setToken={setToken} />
    }

    return (
        <h2>Information about your wallet</h2>
    );
}