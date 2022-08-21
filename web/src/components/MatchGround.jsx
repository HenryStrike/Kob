import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { getList } from '../reducers/botSlice';

class MatchGround extends Component {
    constructor() {
        super();
        this.match_btn = createRef();
    }

    state = {
        selected_bot: "-1",
    }
 
    handleMatchClick() {
        if (this.match_btn.current.innerHTML === "Match") {
            this.match_btn.current.innerHTML = "Cancel";
            this.props.socket.send(JSON.stringify({
                event: "start_matching",
                bot_id : this.state.selected_bot,
            }));
        } else {
            this.match_btn.current.innerHTML = "Match";
            this.props.socket.send(JSON.stringify({
                event: "stop_matching"
            }));
        }
    }

    getBot(event) {
        this.setState({
            selected_bot: event.target.value,
        })
    }

    componentDidMount() {
        this.props.getList({
            token: this.props.token,
            success() { },
            error() { },
        });
    }

    render() {
        return (
            <div className="matchground">
                <div className="row justify-content-md-center">
                    <div className="col-md-4">
                        <div className="user_photo_pk">
                            <img src={this.props.myphoto} alt="myphoto" />
                        </div>
                        <div className="username">
                            {this.props.myname}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="select_bot">
                            <select value={this.state.selected_bot} onChange={(e) => this.getBot(e)} className="form-select" aria-label="Default select example">
                                <option value="-1">Fight on your own</option>
                                {this.props.bot_list.map(item => (
                                    <option value={item.id} key={item.id}>{item.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className='vs_icon'>
                            <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/310/vs-button_1f19a.png" alt="vs" />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="user_photo_pk">
                            <img src={this.props.yourphoto} alt="yourphoto" />
                        </div>
                        <div className="username">
                            {this.props.yourname}
                        </div>
                    </div>
                    <div className="col-md-12 match_btn">
                        <button onClick={() => this.handleMatchClick()} ref={this.match_btn} type="button" className="btn btn-warning btn-lg">Match</button>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        token : state.user.token,
        myphoto: state.user.photo,
        myname: state.user.username,
        yourphoto: state.snakeGame.opponent_photo,
        yourname: state.snakeGame.opponent_username,
        socket: state.snakeGame.socket,
        bot_list: state.bot.bot_list,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getList: (data) => dispatch(getList(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchGround);