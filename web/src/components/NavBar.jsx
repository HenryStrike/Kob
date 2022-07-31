import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import userActions from '../actions/userActions';

function NavBar() {
    const username = useSelector((state) => (state.user.username));
    const photo = useSelector((state) => (state.user.photo));
    const isLoggedIn = useSelector((state) => (state.user.isLoggedIn));
    const isPulling = useSelector((state) => (state.user.isPulling));

    const dispatch = useDispatch();

    function handleLogout(event) {
        event.preventDefault();
        dispatch(userActions.logout());
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <NavLink className="navbar-brand" to="/">King of Bots</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className={({isActive}) => (isActive ? "nav-link active selected" : "nav-link")} to="/game/">Game</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({isActive}) => (isActive ? "nav-link active selected" : "nav-link")} to="/record/">Record</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({isActive}) => (isActive ? "nav-link active selected" : "nav-link")} to="/rank/">Rank</NavLink>
                        </li>
                    </ul>
                    {isLoggedIn && <ul className="navbar-nav">
                        <img src={photo} className="user_photo" alt="userIcon" />
                        <li className="nav-item dropdown">
                            <NavLink className="nav-link dropdown-toggle" to="" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {username}
                            </NavLink>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <li><Link className="dropdown-item" to="/user/bot/">My Bots</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item" to="/" onClick={handleLogout}>Sign out</Link></li>
                            </ul>
                        </li>
                    </ul>}
                    {(!isPulling && !isLoggedIn) && <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/user/login/">Login</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/user/register/">Register</NavLink>
                        </li>
                    </ul>}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;