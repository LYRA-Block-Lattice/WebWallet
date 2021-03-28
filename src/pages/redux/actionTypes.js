// have a look on https://github.com/erikras/ducks-modular-redux

export const STORE_INIT = "STORE_INIT";
export const STORE_INIT_DONE = "STORE_INIT_DONE";

export const WALLET_CREATE = "WALLET_CREATE";
export const WALLET_RESTORE = "WALLET_RESTORE";
export const WALLET_RESTORE_DONE = "WALLET_RESTORE_DONE";
export const WALLET_REMOVE = "WALLET_REMOVE";
export const WALLET_REMOVE_DONE = "WALLET_REMOVE_DONE";

export const WALLET_OPEN = "WALLET_OPEN";
export const WALLET_OPEN_DONE = "WALLET_OPEN_DONE";
export const WALLET_OPEN_FAILED = "WALLET_OPEN_FAILED";
export const WALLET_BALANCE = "WALLET_BALANCE";
export const WALLET_SEND = "WALLET_SEND";
export const WALLET_RECEIVE = "WALLET_RECEIVE";
export const WALLET_CLOSE = "WALLET_CLOSE";

export const WSRPC_CREATE = "WSRPC_CREATE";
export const WSRPC_CREATED = "WSRPC_CREATED";
export const WSRPC_CONNECTED = "WSRPC_CONNECTED";
export const WSRPC_CLOSED = "WSRPC_CLOSED";
export const WSRPC_ERROR = "WSRPC_ERROR";
export const WSRPC_SERVER_SIGNREQ = "WSRPC_SERVER_SIGNREQ";
export const WSRPC_MESSAGE = "WSRPC_MESSAGE";