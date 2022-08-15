import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GameMap } from '../assets/scripts/GameMap';
import { updateGameObject } from '../reducers/snakeGameSlice';

function SnakeGameMap() {
    const root = useRef(null);
    const ctx = useRef(null);
    const game_map = useSelector((state) => (state.snakeGame.game_map));
    const socket = useSelector((state) => (state.snakeGame.socket));

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateGameObject(new GameMap(ctx.current.getContext('2d'), root.current, game_map, socket)));
    }, [dispatch, game_map, socket])

    return (
        <div className='gamemap' ref={root}>
            <canvas ref={ctx} tabIndex="0"></canvas>
        </div>
    );
}

export default SnakeGameMap;