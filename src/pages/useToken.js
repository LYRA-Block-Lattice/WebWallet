import { useState } from 'react';

// token is the password to open wallet.
// passwowrd can be stolen. but the key is safe.
// the private key is stored & encrypted by the password. 
// when use, private key is decrypted and used and then disposed.
// by this way we keep the private key safe

// about multiple wallet
// wallets: {"default", "big one", "small one"}
// defult: password protected binary data
// after open wallet, save {name: 'wallet name', pass: 'password'} 

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token
  }
}