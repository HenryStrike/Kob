import React, { useEffect } from 'react';
import PlayGround from '../../components/PlayGround';
import { useSelector, useDispatch } from 'react-redux';
import MatchGround from '../../components/MatchGround';
import GameResultBoard from '../../components/GameResultBoard';
import { updateSocket, updateOpponent, updateGame, updateStatus, updateGameMove, updateGameResult } from '../../reducers/snakeGameSlice';

function GameIndexView() {
    const token = useSelector((state) => (state.user.token));
    const status = useSelector((state) => (state.snakeGame.status));
    const loser = useSelector((state) => (state.snakeGame.loser));

    const dispatch = useDispatch();

    useEffect(() => {
        if (token !== "") {
            const socketUrl = "ws://127.0.0.1:8080/websocket/" + token;
            const socket = new WebSocket(socketUrl);
            
            socket.onopen = () => {
                console.log("connected");
                dispatch(updateSocket(socket));
            }
            
            socket.onmessage = message => {
                const data = JSON.parse(message.data);
                if (data.event === "match_success") {
                    dispatch(updateOpponent({
                        username: data.opponent_username,
                        photo: data.opponent_photo,
                    }));
                    dispatch(updateGame(data.game));
                    setTimeout(() => {
                        dispatch(updateStatus("playing"));
                    }, 200);
                } else if (data.event === "move") {
                    dispatch(updateGameMove(data));
                } else if (data.event === "result") {
                    dispatch(updateGameResult(data));
                }
            }

            socket.onclose = () => {
                console.log("disconnected");
                dispatch(updateOpponent({
                    username: "My opponent",
                    photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
                }));
            }

            return () => {
                socket.close();
                dispatch(updateStatus("matching"));
            }
        }
    }, [token, dispatch]);

    return (
        <React.Fragment>
            {status === 'playing' && <PlayGround />}
            {status === 'matching' && <MatchGround />}
            {loser !== "" && <GameResultBoard/>}
        </React.Fragment>
    );
}

export default GameIndexView;