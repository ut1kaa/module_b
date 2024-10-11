import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from './TokenValidator';

const PrivateRoute = ({ children }: { children: ReactElement }) => {
    const token = localStorage.getItem('token');
    const isTokenValidClientSide = isTokenValid(token); 
  
    return isTokenValidClientSide ? children : <Navigate to="/login" />;
  };
  
  export default PrivateRoute;