import React, { Component } from 'react';
import PlayGround from '../../components/PlayGround';
import MatchGround from '../../components/MatchGround';
import GameResultBoard from '../../components/GameResultBoard';
import { connect } from 'react-redux';
import { updateSocket, updateOpponent, updateGame, updateStatus, updateLoser } from '../../reducers/snakeGameSlice';
import { updateIsRecord } from '../../reducers/recordSlice';

class GameIndexView extends Component {
    constructor() {
        super();
        this.socket = null;
    }
    componentDidMount() {
        if (this.props.token !== "") {
            const socketUrl = "ws://127.0.0.1:8080/websocket/" + this.props.token;
            this.socket = new WebSocket(socketUrl);

            this.socket.onopen = () => {
                console.log("connected");
                this.props.updateSocket(this.socket);
            }

            this.socket.onmessage = message => {
                const data = JSON.parse(message.data);
                if (data.event === "match_success") {
                    this.props.updateOpponent({
                        username: data.opponent_username,
                        photo: data.opponent_photo,
                    });
                    this.props.updateGame(data.game);
                    setTimeout(() => {
                        this.props.updateStatus("playing");
                    }, 200);
                } else if (data.event === "move") {
                    this.props.game_object.set_directions(data);
                } else if (data.event === "result") {
                    this.props.game_object.set_status(data);
                    this.props.updateLoser(data.loser);
                }
            }

            this.socket.onclose = () => {
                console.log("disconnected");
                this.props.updateOpponent({
                    username: "???",
                    photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
                });
                this.props.updateGame({
                    game_map : null,
                    a_id : 0,
                    a_sx : 0,
                    a_sy : 0,
                    b_id : 0, 
                    b_sx : 0,
                    b_sy : 0,
                });
            }
        }
    }

    componentWillUnmount() {
        this.socket.close();
        this.props.updateStatus("matching");
        this.props.updateLoser("");
    }

    render() {
        return (
            <React.Fragment>
                <div className="container pt-5">
                    {this.props.status === 'playing' && <PlayGround />}
                    {this.props.status === 'matching' && <MatchGround />}
                    {this.props.loser !== "" && <GameResultBoard />}
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.user.token,
        status: state.snakeGame.status,
        loser: state.snakeGame.loser,
        game_object: state.snakeGame.game_object,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateSocket: (obj) => dispatch(updateSocket(obj)),
        updateOpponent: (data) => dispatch(updateOpponent(data)),
        updateGame: (obj) => dispatch(updateGame(obj)),
        updateStatus: (payload) => dispatch(updateStatus(payload)),
        updateLoser: (payload) => dispatch(updateLoser(payload)),
        updateIsRecord : (payload) => dispatch(updateIsRecord(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameIndexView);