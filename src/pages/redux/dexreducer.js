import * as actionTypes from "./actionTypes";

const initState = {
  userid: null,
  loggedin: false,
  pending: false,
  error: null,
};

const dexReducer = (state = initState, action) => {
  if (action === undefined) {
    return state;
  }

  switch (action.type) {
    case actionTypes.DEX_SIGNIN:
      return {
        ...state,
      };

    default: {
      return state;
    }
  }
};

export default dexReducer;
