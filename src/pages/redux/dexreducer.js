import * as actionTypes from "./actionTypes";

const initState = {
  signedup: false,
  userid: null,
  loggedin: false,
  pending: false,
  error: null,
  coins: [],
};

const dexReducer = (state = initState, action) => {
  if (action === undefined) {
    return state;
  }

  switch (action.type) {
    case actionTypes.DEX_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.DEX_ERROR_CLEAR:
      return {
        ...state,
        error: null,
      };
    // case actionTypes.DEX_SIGNUP:
    //   return {
    //     ...state,
    //     signedup: false,
    //     error: null,
    //   };
    case actionTypes.DEX_SIGNUP_OK:
      return {
        ...state,
        signedup: true,
      };
    case actionTypes.DEX_SIGNIN:
      return {
        ...state,
        error: null,
      };
    case actionTypes.DEX_SIGNIN_OK:
      return {
        ...state,
        userid: action.payload.result.name,
        loggedin: action.payload.token !== undefined,
        pending: false,
        error: null,
      };
    case actionTypes.DEX_LOGOUT:
      return { ...state, userid: null, loggedin: false, errors: null };

    default: {
      return state;
    }
  }
};

export default dexReducer;
