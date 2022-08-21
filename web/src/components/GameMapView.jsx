import React, { Component } from 'react';
import { createRef } from 'react';
import { updateGameObject } from '../reducers/snakeGameSlice';
import { connect } from 'react-redux';
import { GameMap } from '../assets/scripts/GameMap';

class GameMapView extends Component {
    constructor() {
        super();
        this.root = createRef();
        this.ctx = createRef();
    }

    componentDidMount() {
        this.props.updateGameObject(new GameMap(this.ctx.current.getContext('2d'), this.root.current, this.props.game_map, this.props.socket));
    }

    componentWillUnmount() {
        this.props.updateGameObject(null);
    }

    render() {
        return (
            <div className='gamemap' ref={this.root}>
                <canvas ref={this.ctx} tabIndex="0"></canvas>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        game_map : state.snakeGame.game_map,
        socket : state.snakeGame.socket,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateGameObject : (obj) => dispatch(updateGameObject(obj)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(GameMapView);