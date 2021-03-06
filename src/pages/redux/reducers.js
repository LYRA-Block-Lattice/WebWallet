import { combineReducers } from "redux";
import visibilityFilter from "./reducerVis";
import todos from "./reducerMod";

export default combineReducers({ todos, visibilityFilter });
