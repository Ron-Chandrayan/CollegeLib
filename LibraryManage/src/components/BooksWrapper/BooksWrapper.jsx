import React from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import Books from '../Books/Books';

function BooksWrapper() {
  const { signup } = useOutletContext();

  if (!signup) {
    return <Navigate to="/" replace />;
  }

  return <Books />;
}

export default BooksWrapper;
