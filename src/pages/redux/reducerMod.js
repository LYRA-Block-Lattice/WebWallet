import { WALLET_OPEN } from "./actionTypes";

const initialState = {
  allIds: [],
  byIds: {}
};

export default function todos(state = initialState, action) {
  switch (action.type) {
    case WALLET_OPEN: {
      const { id, content } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, id],
        byIds: {
          ...state.byIds,
          [id]: {
            content,
            completed: false
          }
        }
      };
    }
    default:
      return state;
  }
}
