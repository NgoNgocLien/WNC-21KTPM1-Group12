import React from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
// import jwt_decode from 'jwt-decode';
import "./App.css";

import Login from './pages/Login'
import Home from './pages/Home'

import isTokenValid from './utils/isTokenValid'


const ProtectedRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');

  
  return isTokenValid(token) ? element : <Navigate to="/login" />;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ProtectedRoute element={<Home />} />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
