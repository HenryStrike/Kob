import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GameMap } from '../assets/scripts/GameMap';

function GameMapView() {
    const root = useRef(null);
    const ctx = useRef(null);
    const game_map = useSelector((state) => (state.game.game_map));

    useEffect(() => {
        new GameMap(ctx.current.getContext('2d'), root.current, game_map);
    })

    return (
        <div className='gamemap' ref={root}>
            <canvas ref={ctx} tabIndex="0"></canvas>
        </div>
    );
}

export default GameMapView;