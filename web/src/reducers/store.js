import { combineReducers } from "redux";
import { configureStore} from "@reduxjs/toolkit";
import UserReducer from './user';
import MessageReducer from "./message";

const reducer = combineReducers({
    user : UserReducer,
    message : MessageReducer,
});

const store = configureStore({
    reducer,
});

export default store;