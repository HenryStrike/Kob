import React from 'react';
import { useSelector, useDispatch } from 'react-redux/es/exports';
import { updateGameResult, updateStatus } from '../reducers/snakeGameSlice';

function GameResultBoard() {
    const loser = useSelector((state) => (state.snakeGame.loser));
    const a_id = useSelector((state) => (state.snakeGame.a_id));
    const b_id = useSelector((state) => (state.snakeGame.b_id));
    const id = useSelector((state) => (state.user.id));
    const socket = useSelector((state) => (state.snakeGame.socket));

    const dispatch = useDispatch();

    function handleRestart() {
        dispatch(updateStatus("matching"));
        dispatch(updateGameResult({
            loser : "",
        }));
        socket.onclose();
    }

    return ( 
        <div className="result-board">
            {loser === "all" && <div className='result-board-text'>
                Draw
            </div>}
            {((loser === "a" && a_id == id) || (loser === "b" && b_id == id))  && <div className='result-board-text'>
                You lose
            </div>}
            {((loser === "a" && b_id == id) || (loser === "b" && a_id == id))  && <div className='result-board-text'>
                You win
            </div>}
            <div className="result-board-btn">
                <button onClick={handleRestart} type="button" className="btn btn-warning btn-lg">Try again</button>
            </div>
        </div>
     );
}

export default GameResultBoard;