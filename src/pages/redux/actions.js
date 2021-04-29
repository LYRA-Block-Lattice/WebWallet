import { WALLET_OPEN } from "./actionTypes";

// open wallet not really open the wallet.
// it save the wallet name and wallet password. (with verifycation of it)
// passwowrd can be stolen. but the key is safe.
// the private key is stored & encrypted by the password.
// when use, private key is decrypted and used and then disposed.
// by this way we keep the private key safe

// about multiple wallet
// wallets: {"default", "big one", "small one"}
// defult: password protected binary data
// after open wallet, save {name: 'wallet name', pass: 'password'}

// save to persistant storage provided by localforage, named 'rxstor'
//
// {
//   network: 'testnet',
//   wallets: [
//      {name: 'wallet name', data: '[base64(password encrypted binary data)]'},
//      { ...} ...
//   ]
// }

export const openWallet = (name, password) => ({
  type: WALLET_OPEN,
  payload: {
    name: name,
    password: password,
  },
});
