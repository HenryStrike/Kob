import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseContainer from '../../../components/BaseContainer';
import { regiser } from '../../../reducers/userSlice';

function UserAccountRegisterView() {
    const username = useRef(null);
    const password = useRef(null);
    const confirmedPassword = useRef(null);
    const message = useRef(null);
    const navigate = useNavigate();

    function handleRegister(event) {
        event.preventDefault();

        const data = {
            username: username.current.value,
            password: password.current.value,
            confirmedPassword: confirmedPassword.current.value,
            success() {
                navigate('/user/login/');
            },
            error(resp) {
                message.current.innerHTML = resp.runtime_message;
            }
        }
        regiser(data);
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
                        <div className="mb-3">
                            <span>
                                <img className='login_icon' src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/310/locked-with-pen_1f50f.png" alt="person" />
                            </span>
                            <label htmlFor="confirmedPassword" className="form-label">Confirm Password</label>
                            <input ref={confirmedPassword} type="password" className="form-control" id="confirmedPassword" placeholder="Enter your password again" />
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