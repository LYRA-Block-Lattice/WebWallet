import { RippleAPI } from 'ripple-lib';

const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'});
const address = 'r3aiT2inVAJQP5mzszBsSEyb1ehyaxKJHr';

let balance;

api.connect().then(() => {
  api.getBalances(address).then(balances => {
      balance = balances;
    console.log(JSON.stringify(balances, null, 2));
  })
}).catch(err => console.error);

const Xrp = () => (
    <div>
      <h1>The balance is:</h1>
      <p>{JSON.stringify(balance, null, 2)}</p>
    </div>
  );
  
  export default Xrp;