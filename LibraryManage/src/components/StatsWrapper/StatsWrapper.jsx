import React from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import Stats from '../Stats/Stats';

function StatsWrapper() {
  const { signup } = useOutletContext();

  if (!signup) {
    return <Navigate to="/" replace />;
  }

  return <Stats />;
}

export default StatsWrapper;
 
