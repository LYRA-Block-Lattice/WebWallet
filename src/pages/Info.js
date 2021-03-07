import React from 'react';
import useToken from './useToken';
import OpenWallet from './OpenWallet';

export default function Info() {
    const { token, setToken } = useToken();

    if (!token) {
        return <OpenWallet setToken={setToken} />
    }

    return (
        <div>
            <h2>Information about your wallet</h2>
            <p>Your wallet address is:</p>
            <pre>{token}</pre>
        </div>
        
    );
}