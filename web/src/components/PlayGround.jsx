import React, { Component } from 'react';
import GameMapView from './GameMapView';
import { connect } from 'react-redux';

class PlayGround extends Component {
    state = {
        color : "",
    }

    componentDidMount() {
        this.setState({
            color : this.props.user_id == this.props.a_id ? "blue" : "red",
        })
    }

    render() { 
        return (
            <div className="playground">
                <GameMapView/>
                <div className='game_identi'>
                    Your color is: 
                    <span className='game_color' style={{backgroundColor : this.state.color === "blue" ? "#4876EC" : "#F94848"}}>
                        {this.state.color}
                    </span>
                </div>
            </div>
        );
    }
}
 
function mapStateToProps(state) {
    return {
        a_id : state.snakeGame.a_id,
        user_id : state.user.id,
    }
}

export default connect(mapStateToProps, null)(PlayGround);