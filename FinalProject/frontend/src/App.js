import './App.css';
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Header from './components/Header';
import Home from './pages/Guest/Home';
import About from './pages/Guest/About';
import Login from './pages/Guest/Login';

import Sidebar from './components/Sidebar';
import Account from './pages/SignIn/Account';
import TransferInternal from './pages/SignIn/TransferInternal';
import TransferExternal from './pages/SignIn/TransferExternal';
import DebtList from './pages/SignIn/Debt/DebtList';

import NotFound from './pages/NotFound';

const ProtectedRoute = ({ element, redirectTo }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to={redirectTo} /> : element;
};

const AuthenticatedRoute = ({ element, redirectTo }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? element : <Navigate to={redirectTo} />;
};

function LayoutGuest() {
  return (
    <div className="layout">
      <Header />
      <Outlet />
    </div>
  );
}

function LayoutSignIn() {
  return (
    <div className="layout">
      <Sidebar />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute element={<LayoutGuest />} redirectTo="/account" />
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>

        <Route
          path="login"
          element={<ProtectedRoute element={<Login />} redirectTo="/account" />}
        />

        <Route path="/" element={<AuthenticatedRoute element={<LayoutSignIn />} redirectTo="/home" />}>
          <Route path="account" element={<Account />} />
          <Route path="transfer-internal" element={<TransferInternal />} />
          <Route path="transfer-external" element={<TransferExternal />} />
          <Route path="debt" element={<DebtList />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
