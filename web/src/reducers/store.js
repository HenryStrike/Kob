import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import botReducer from "./botSlice";
import gameReducer, { updateOpponent, updateStatus, updateGameMap } from "./gameSlice";

let socket = null;

const reducer = combineReducers({
    user: userReducer,
    bot: botReducer,
    game: gameReducer,
});

const socketMiddleware = storeAPI => next => action => {
    switch (action.type) {
        case "CREATE_SOCKET":
            socket = new WebSocket(action.payload);
            socket.onmessage = message => {
                const data = JSON.parse(message.data);
                if (data.event === "match_success") {
                    storeAPI.dispatch(updateOpponent({
                        username: data.opponent_username,
                        photo: data.opponent_photo,
                    }));
                    storeAPI.dispatch(updateGameMap(data.game_map));
                    setTimeout(() => {
                        storeAPI.dispatch(updateStatus("playing"));
                    }, 2000);
                }else if(data.event === "game_over") {
                    storeAPI.dispatch(updateOpponent({
                        username: "My opponent",
                        photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
                    }));
                    storeAPI.dispatch(updateStatus("matching"));
                }
            }
            break;
        case "SEND_MESSAGE":
            socket.send(JSON.stringify({
                event: action.payload,
            }));
            break;
        case "REMOVE_SOCKET":
            socket.close();
            storeAPI.dispatch(updateStatus("matching"));
            break;
        default:
            break;
    };
    next(action);
}

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(socketMiddleware),
});

export default store;