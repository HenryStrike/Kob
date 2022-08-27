import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import botReducer from "./botSlice";
import snakeGameReducer from "./snakeGameSlice";
import recordReducer from "./recordSlice";
import rankReducer from "./rankSlice";

const reducer = combineReducers({
    user: userReducer,
    bot: botReducer,
    snakeGame: snakeGameReducer,
    record : recordReducer,
    rank : rankReducer,
});

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
});

export default store;