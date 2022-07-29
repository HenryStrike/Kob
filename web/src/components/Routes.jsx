import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import ProtectRoute from './ProtectRoute';
import RecordIndexView from '../views/Record/RecordIndexView';
import PkIndexView from '../views/PK/PkIndexView';
import RankIndexView from '../views/Rank/RankIndexView';
import NotFound from '../views/Error/NotFound';
import UserBotIndexView from '../views/User/Bot/UserBotIndexView';
import UserAccountLoginView from '../views/User/Account/UserAccountLoginView';
import UserAccountRegisterView from '../views/User/Account/UserAccountRegisterView';

const Routes = (isLoggedIn) => {
    return [
        {
            path : '/',
            element : <Navigate replace to="/pk/"/>,
        },
        {
            path : '/rank',
            element : ProtectRoute(<RankIndexView/>, isLoggedIn, "/user/login/"),
        },
        {
            path : '/pk',
            element : <PkIndexView/>,
        },
        {
            path : '/record',
            element : ProtectRoute(<RecordIndexView/>, isLoggedIn, "/user/login/"),
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
                    element : <UserBotIndexView/>,
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