import React, { Component } from 'react';
import GameMapView from './GameMapView';

class PlayGround extends Component {
    state = {  } 
    render() { 
        return (
            <div className="playground">
                <GameMapView/>
            </div>
        );
    }
}
 
export default PlayGround;