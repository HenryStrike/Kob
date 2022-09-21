import React, { Component } from 'react';
import { connect } from 'react-redux';

class UserProfileCard extends Component {
    state = {}
    render() {
        return (
            <div className="card mt-3">
                <img src={this.props.photo} className="card-img-top" alt="user_icon" style={{ width: "100%" }} />
                <div className="card-body">
                    <h5 className="card-title">{this.props.username}</h5>
                    <p className="card-text">Rank score : {this.props.score}</p>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.user.token,
        photo: state.user.photo,
        username: state.user.username,
        score : state.user.score,
    }
}

export default connect(mapStateToProps, null)(UserProfileCard);