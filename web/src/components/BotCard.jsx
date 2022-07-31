import React, { Component } from 'react';

class BotCard extends Component {
    render() {
        return (
            <div className="card mt-3">
                <div className="card-header">
                    Game Bot
                    <button type="button" className="btn btn-secondary btn-sm" style={{float: "right"}}>Edit</button>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-sm-2 text-center">
                            <img className='robot_icon' src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/322/robot_1f916.png" alt="robot_icon" />
                        </div>
                        <div className="col-sm-3">
                            <h5 className="card-title">{this.props.title}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">Score : {this.props.score}</h6>
                        </div>
                        <div className="col-sm-7">
                            <p className="card-text">" {this.props.description} "</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BotCard;