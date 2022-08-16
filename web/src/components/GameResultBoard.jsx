import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateLoser, updateStatus } from '../reducers/snakeGameSlice';

class GameResultBoard extends Component {
    handleRestart() {
        this.props.updateStatus("matching");
        this.props.updateLoser("");
        this.props.socket.onclose();
    }

    render() { 
        return (
            <div className="result-board">
            {this.props.loser === "all" && <div className='result-board-text'>
                Draw
            </div>}
            {((this.props.loser === "a" && this.props.a_id == this.props.id) || (this.props.loser === "b" && this.props.b_id == this.props.id))  && <div className='result-board-text'>
                You lose
            </div>}
            {((this.props.loser === "a" && this.props.b_id == this.props.id) || (this.props.loser === "b" && this.props.a_id == this.props.id))  && <div className='result-board-text'>
                You win
            </div>}
            <div className="result-board-btn">
                <button onClick={() => this.handleRestart()} type="button" className="btn btn-warning btn-lg">Try again</button>
            </div>
        </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        loser : state.snakeGame.loser,
        a_id : state.snakeGame.a_id,
        b_id : state.snakeGame.b_id,
        id : state.user.id,
        socket : state.snakeGame.socket,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateStatus : (payload) => dispatch(updateStatus(payload)),
        updateLoser : (payload) => dispatch(updateLoser(payload)),
    }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(GameResultBoard);