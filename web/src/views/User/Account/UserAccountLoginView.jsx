import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BaseContainer from '../../../components/BaseContainer';
import userActions from '../../../actions/userActions';

function UserAccountLoginView() {
    const username = useRef(null);
    const password = useRef(null);
    let message = useRef(null);
    const isPulling = useSelector((state) => (state.user.isPulling));

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLogin(event) {
        event.preventDefault();

        const data = {
            username: username.current.value,
            password: password.current.value,
            success(resp) {
                dispatch(userActions.getInfo({
                    token: resp.token,
                    success(resp) {
                        navigate('/');
                    },
                    error(resp) {
                        message.current.innerText = "Fail to get user info";
                    }
                }));
            },
            error(resp) {
                message.current.innerText = "Wrong name or password";
            },
        };

        message.current.innerText = "";
        dispatch(userActions.login(data));
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
                            <label htmlFor="username" className="form-label">User name</label>
                            <input ref={username} type="text" className="form-control" id="username" placeholder="Enter your name" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input ref={password} type="text" className="form-control" id="password" placeholder="Enter your password" />
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