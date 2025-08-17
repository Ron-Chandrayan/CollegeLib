import React from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import Library from '../Library/Library';

function LibraryWrapper() {
  const { signup } = useOutletContext();

  if (!signup) {
    return <Navigate to="/" replace />;
  }

  return <Library />;
}

export default LibraryWrapper;
