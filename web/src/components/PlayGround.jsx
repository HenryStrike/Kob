import React, { Component } from 'react';
import SnakeGameMap from './SnakeGameMap';

class PlayGround extends Component {
    state = {  } 
    render() { 
        return (
            <div className="playground">
                <SnakeGameMap/>
            </div>
        );
    }
}
 
export default PlayGround;