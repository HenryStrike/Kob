import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import ProtectRoute from './ProtectRoute';
import RecordIndexView from '../views/Record/RecordIndexView';
import RecordContentView from '../views/Record/RecordContentView';
import GameIndexView from '../views/Game/GameIndexView';
import RankIndexView from '../views/Rank/RankIndexView';
import NotFound from '../views/Error/NotFound';
import UserBotIndexView from '../views/User/Bot/UserBotIndexView';
import UserAccountLoginView from '../views/User/Account/UserAccountLoginView';
import UserAccountRegisterView from '../views/User/Account/UserAccountRegisterView';
import IndexView from './../views/IndexView';

const Routes = (isLoggedIn) => {
    return [
        {
            path : '/',
            element : <Navigate replace to="/home/"/>,
        },
        {
            path : '/home',
            element : <IndexView/>,
        },
        {
            path : '/rank',
            element : ProtectRoute(<RankIndexView/>, isLoggedIn, "/user/login/"),
        },
        {
            path : '/game',
            element : ProtectRoute(<GameIndexView/>, isLoggedIn, "/user/login/"),
        },
        {
            path : '/record',
            element : ProtectRoute(<RecordIndexView/>, isLoggedIn, "/user/login/"),
        },
        {
            path : '/record/:recordId/',
            element : ProtectRoute(<RecordContentView/>, isLoggedIn, "/user/login/"),
        },
        {
            path : '/404',
            element : <NotFound/>,
        },
        {
            path : '/user',
            element : <Outlet/>,
            children : [
                {
                    path : 'bot',
                    element : ProtectRoute(<UserBotIndexView/>, isLoggedIn, "/user/login/"),
                },
                {
                    path : 'login',
                    element : ProtectRoute(<UserAccountLoginView/>, !isLoggedIn, "/"),
                },
                {
                    path : 'register',
                    element : <UserAccountRegisterView/>,
                },
            ],
        },
        {
            path : '*',
            element : <Navigate replace to='/404'/>,
        },
    ];
}

export default Routes;