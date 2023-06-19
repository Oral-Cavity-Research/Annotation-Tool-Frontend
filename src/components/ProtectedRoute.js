import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({children}) => {

    const userData = useSelector(state => state.data);
    const user = userData.email? userData.email: null

    if(!user) return <Navigate to="/login" replace />;
 
    return (children);
    
};

export default ProtectedRoute;