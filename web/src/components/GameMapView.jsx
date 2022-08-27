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
        this.props.updateGameObject(new GameMap(this.ctx.current.getContext('2d'), this.root.current, this.props.is_record, this.props.game_map, this.props.socket, this.props.a_steps, this.props.b_steps, this.props.record_loser));
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
        is_record : state.record.is_record,
        a_steps : state.record.a_steps,
        b_steps : state.record.b_steps,
        record_loser : state.record.record_loser,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateGameObject : (obj) => dispatch(updateGameObject(obj)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(GameMapView);