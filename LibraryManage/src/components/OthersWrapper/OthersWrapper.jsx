import React from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import Others from '../Others/Others';

function OthersWrapper() {
  const { signup } = useOutletContext();

  if (!signup) {
    return <Navigate to="/" replace />;
  }

  return <Others/>;
}

export default OthersWrapper;
 
