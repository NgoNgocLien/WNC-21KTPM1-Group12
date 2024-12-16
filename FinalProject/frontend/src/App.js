import './App.css';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

import Header from './components/Header';

function Layout() {
  return (
    <div className='layout'>
      {/* <SideBar /> */}
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
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
