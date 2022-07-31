import { combineReducers } from "redux";
import { configureStore} from "@reduxjs/toolkit";
import UserReducer from './user';
import BotReducer from "./bot";

const reducer = combineReducers({
    user : UserReducer,
    bot : BotReducer,
});

const store = configureStore({
    reducer,
});

export default store;