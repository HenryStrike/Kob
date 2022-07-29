import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BaseContainer from '../../../components/BaseContainer';
import userActions from '../../../actions/userActions';

function UserAccountRegisterView() {
    const username = useRef(null);
    const password = useRef(null);
    const confirmedPassword = useRef(null);
    const message = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleRegister (event) {
        event.preventDefault();

        const data = {
            username : username.current.value,
            password : password.current.value,
            confirmedPassword : confirmedPassword.current.value,
            success(resp) {
                navigate('/user/login/');
            },
            error(resp) {
                message.current.innerText = resp.runtime_message;
            }
        }

        dispatch(userActions.regiser(data));
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
                        <div className="mb-3">
                            <label htmlFor="confirmedPassword" className="form-label">Confirm Password</label>
                            <input ref={confirmedPassword} type="text" className="form-control" id="password" placeholder="Enter your password again" />
                        </div>
                        <p className="text-center text-danger" ref={message}></p>
                        <button onClick={handleRegister} type="submit" className="btn btn-primary w-100">Register</button>
                    </form>
                </div>
            </div>
        </BaseContainer>
    );
}

export default UserAccountRegisterView;