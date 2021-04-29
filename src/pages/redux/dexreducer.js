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
    case actionTypes.DEX_SIGNIN_OK:
      //localStorage.setItem("profile", JSON.stringify({ ...action?.data }));

      return {
        ...state,
        userid: action.payload.result.name,
        loggedin: action.payload.token !== undefined,
        pending: false,
        error: null,
      };
    case actionTypes.DEX_LOGOUT:
      //localStorage.clear();

      return { ...state, userid: null, loggedin: false, errors: null };

    default: {
      return state;
    }
  }
};

export default dexReducer;
