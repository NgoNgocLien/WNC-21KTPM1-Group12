import React from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import "./App.css";

import Login from './pages/Login'
import Home from './pages/Home'


const ProtectedRoute = ({ element, ...rest }) => {
  const isAuthenticated = localStorage.getItem('auth') === 'true';

  return isAuthenticated ? element : <Navigate to="/login" />;
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
