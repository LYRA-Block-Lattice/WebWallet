import { createContext } from 'react';

const lyraCtx = {
    network: 'testnet',
    wss: undefined
}

export const LyraContext = createContext(lyraCtx);

export default LyraContext;