const initState = {
    todos: [
        {
            id: "0",
            text: "Learn React hooks",
        },
    ],
    account: {
        pvk: "54ff7b8aa7730b5fb41676f55c721967a2dd553678a40b856b580db9f946cda7",
        puk: "046f8815c5e79ba81f1cc9e4f8a311c70d8fa55e9792bd0d682e8a7ac157f28187b31edf7555b7b60ca6623150e7dd19d23d1d9ac2fc64d89a73bb2386247f2082",
        accountId: "LFbJq1N4fSdSLudWWACgYfpwKfpLrekT6ECR6knCX2br66wydpNpbFywoT6FrSwvoVSrb8zPzrcrFG4K7q7i8UVFKtkfnN",
        unrecv: 0,
        unrecvlyr: 0,
        balance: 0
    },
};
  
const todos = (state = initState, action) => {
    switch (action.type) {
        case "ADD_TODO":
            return { todos: [...state.todos, action.payload] };
        case "DONE_TODO":
            return {
                todos: state.todos.filter(todo => todo.id !== action.payload),
            };
        default:
            return state;
    }
};

export default todos;

export const ledge = (state = initState, action) => {
    switch (action.type) {
        case "BALANCE":
            return { account: { ...state.account, action }  };
        default:
            return state;
    }
};
