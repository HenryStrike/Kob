import React, { Component } from 'react';
import { GameMap } from '../assets/scripts/GameMap';

class GameMapView extends Component {
    constructor(props){
        super(props);

        this.root = React.createRef();
        this.ctx = React.createRef();
    }

    componentDidMount() {
        new GameMap(this.ctx.current.getContext('2d'), this.root.current);
    }

    render() { 
        return (
            <div className='gamemap' ref={this.root}>
                <canvas ref={this.ctx}></canvas>
            </div>
        );
    }
}
 
export default GameMapView;