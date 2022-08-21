import React, { Component, createRef } from 'react';
import { regiser } from '../../../reducers/userSlice';
import { connect } from 'react-redux';
import BaseContainer from '../../../components/BaseContainer';
import { Navigate } from 'react-router-dom';

class UserAccountRegisterView extends Component {
    constructor() {
        super();
        this.username = createRef();
        this.password = createRef();
        this.confirmedPassword = createRef();
        this.message = createRef();
        this.handleRegister = this.handleRegister.bind(this);
    }

    state = {
        navigated : false,
    }

    handleRegister(event) {
        event.preventDefault();

        const navigate = () => {
            this.setState({
                navigated : true,
            })
        };
        const setMessage = (message) => {
            this.message.current.innerHTML = message;
        };

        this.props.regiser({
            username: this.username.current.value,
            password: this.password.current.value,
            confirmedPassword: this.confirmedPassword.current.value,
            success() {
                navigate();
            },
            error(resp) {
                setMessage(resp.runtime_message);
            }
        })
    }

    render() {
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
                            <div className="mb-3">
                                <span>
                                    <img className='login_icon' src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/310/locked-with-pen_1f50f.png" alt="person" />
                                </span>
                                <label htmlFor="confirmedPassword" className="form-label">Confirm Password</label>
                                <input ref={this.confirmedPassword} type="password" className="form-control" id="confirmedPassword" placeholder="Enter your password again" />
                            </div>
                            <p className="text-center text-danger" ref={this.message}></p>
                            <button onClick={this.handleRegister} type="submit" className="btn btn-primary w-100">Register</button>
                            {this.state.navigated && <Navigate to="/user/login/" replace={true} />}
                        </form>
                    </div>
                </div>
            </BaseContainer>
        );
    }
}

function mapDispatchToProps() {
    return {
        regiser : (data) => regiser(data),
    }
}

export default connect(null, mapDispatchToProps)(UserAccountRegisterView);