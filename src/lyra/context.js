import { createContext } from 'react';

import JsonRpcClient from './jsonrpcclient';

const lyraCtx = {
    network: 'testnet',
    wss: undefined
}

export const LyraContext = createContext(lyraCtx);

export default LyraContext;