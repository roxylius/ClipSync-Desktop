import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Signup from './components/signup';

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<Signup />} />
      <Route path='/login' element={<Signup />} />
    </Routes>
  );
}

export default App;
