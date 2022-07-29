import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectRoute(element, auth, path) {
    return auth ? element : <Navigate replace to={path} />;
}

export default ProtectRoute;