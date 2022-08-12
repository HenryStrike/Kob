import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BaseContainer from '../../../components/BaseContainer';
import { login, getInfo } from '../../../reducers/userSlice';

function UserAccountLoginView() {
    const username = useRef(null);
    const password = useRef(null);
    const message = useRef(null);
    const isPulling = useSelector((state) => (state.user.isPulling));

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLogin(event) {
        event.preventDefault();

        const data = {
            username: username.current.value,
            password: password.current.value,
            success(resp) {
                dispatch(getInfo({
                    token: resp.token,
                    success(resp) {
                        navigate('/');
                    },
                    error(resp) {
                        message.current.innerHTML = "Fail to get user info";
                    }
                }));
            },
            error() {
                message.current.innerHTML = "Wrong name or password";
            },
        };

        message.current.innerHTML = "";
        dispatch(login(data));
    };

    if (isPulling) {
        return (
            <div></div>
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
                            <input ref={username} type="text" className="form-control" id="username" placeholder="Enter your name" />
                        </div>
                        <div className="mb-3">
                            <span>
                                <img className='login_icon' src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/310/locked_1f512.png" alt="lock" />
                            </span>
                            <label htmlFor="password" className="form-label">Password</label>
                            <input ref={password} type="password" className="form-control" id="password" placeholder="Enter your password" />
                        </div>
                        <p className="text-center text-danger" ref={message}></p>
                        <button onClick={handleLogin} type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                </div>
            </div>
        </BaseContainer>
    );

}

export default UserAccountLoginView;