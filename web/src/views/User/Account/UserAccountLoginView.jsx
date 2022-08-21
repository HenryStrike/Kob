import React, { Component, createRef } from 'react';
import BaseContainer from '../../../components/BaseContainer';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { login, getInfo } from '../../../reducers/userSlice';

class UserAccountLoginView extends Component {
    constructor() {
        super();
        this.username = createRef();
        this.password = createRef();
        this.message = createRef();
        this.handleLogin = this.handleLogin.bind(this);
    }

    state = {
        navigated : false,
    }

    handleLogin(event) {
        event.preventDefault();

        const setMessage = (message) => {
            this.message.current.innerHTML = message;
        };
        const navigate = () => {
            this.setState({
                navigated : true,
            });
        };
        const getInfo = (resp) => this.props.getInfo({
            token: resp.token,
            success() {
                navigate();
            },
            error() {
                setMessage("Fail to get user info");
            }
        });

        this.props.login({
            username: this.username.current.value,
            password: this.password.current.value,
            success(resp) {
                getInfo(resp);
            },
            error() {
                setMessage( "Wrong name or password");
            },
        })
        setMessage("");
    }

    render() { 
        if (this.props.isPulling) {
            return (
                <React.Fragment/>
            );
        }
        return (
            <BaseContainer>
            <div className="row justify-content-md-center">
                <div className="col-3">
                    <form>
                        <div className="mb-3">
                            <span>
                                <img className='login_icon' src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/310/person_1f9d1.png" alt="person" />
                            </span>
                            <label htmlFor="username" className="form-label">User name</label>
                            <input ref={this.username} type="text" className="form-control" id="username" placeholder="Enter your name" />
                        </div>
                        <div className="mb-3">
                            <span>
                                <img className='login_icon' src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/310/locked_1f512.png" alt="lock" />
                            </span>
                            <label htmlFor="password" className="form-label">Password</label>
                            <input ref={this.password} type="password" className="form-control" id="password" placeholder="Enter your password" />
                        </div>
                        <p className="text-center text-danger" ref={this.message}></p>
                        <button onClick={this.handleLogin} type="submit" className="btn btn-primary w-100">Login</button>
                        {this.state.navigated && <Navigate to="/" replace={true} />}
                    </form>
                </div>
            </div>
        </BaseContainer>
        );
    }
}

function mapStateToProps(state) {
    return {
        isPulling : state.user.isPulling,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login : (data) => dispatch(login(data)),
        getInfo : (data) => dispatch(getInfo(data)),
    }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(UserAccountLoginView);