import './App.css';
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

import Header from './components/Header';

function Layout() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated 
    ? (
      <div className='layout'>
        {/* <Header/> */}
        {/* <SideBar /> */}
        <Outlet />
        {/* <Footer /> */}
      </div>
    ) 
    : <Navigate to="/login" />;

}


function App() {
  return (
    <Router>
      <Routes >
        <Route path="" element={<Layout />} >
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
