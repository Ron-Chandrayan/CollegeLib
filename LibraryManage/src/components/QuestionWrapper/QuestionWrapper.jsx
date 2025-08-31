import React from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import Questionpaper from '../Questionpaper/Questionpaper';

function QuestionWrapper() {
  const { signup } = useOutletContext();

  if (!signup) {
    return <Navigate to="/" replace />;
  }

  return <Questionpaper />;
}

export default QuestionWrapper;
 
