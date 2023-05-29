import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Signup from './components/signup';
import ClipB from './components/clipboard';

function App() {
  return (
    <Routes>
      {/* <Route exact path='/' element={<Signup />} /> */}
      {/* <Route path='/login' element={<Signup />} /> */}
      <Route path='/' element={<ClipB />} />
    </Routes>
  );
}

export default App;
