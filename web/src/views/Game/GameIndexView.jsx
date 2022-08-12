import React, { useEffect } from 'react';
import PlayGround from '../../components/PlayGround';
import { useSelector, useDispatch } from 'react-redux';
import MatchGround from '../../components/MatchGround';

function GameIndexView() {
    const token = useSelector((state) => (state.user.token));
    const status = useSelector((state) => (state.game.status));

    const dispatch = useDispatch();

    useEffect(() => {
        if (token !== "") {
            const socketUrl = "ws://127.0.0.1:8080/websocket/" + token;
            dispatch({
                type : "CREATE_SOCKET",
                payload : socketUrl,
            });
            return () => {
                dispatch({
                    type : "REMOVE_SOCKET",
                });
            }
        }
    }, [token, dispatch]);

    return (
        <React.Fragment>
            {status === 'playing' && <PlayGround />}
            {status === 'matching' && <MatchGround />}
        </React.Fragment>
    );
}

export default GameIndexView;