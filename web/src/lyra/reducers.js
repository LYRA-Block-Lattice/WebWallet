const initState = {
    wallet: [
      {
        pvk: "",
        puk: "",
        accountId: "",
        unrecv: 0,
        unrecvlyr: 0,
        balance: 0
      },
    ],
  };
  
  const wallet = (state = initState, action) => {
    switch (action.type) {
      case "CREATE":
        return action.payload;
      case "BALANCE":
        return {
          ...state, balance: action.balance          
        };
      default:
        return state;
    }
  };
  
  export default wallet;