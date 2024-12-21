import './App.css';
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Header from './components/Header';
import Home from './pages/Guest/Home';
import About from './pages/Guest/About';
import Login from './pages/Guest/Login';

import Sidebar from './components/Sidebar';
import Account from './pages/SignIn/Account';
import Transfer from './pages/SignIn/Transfer/Transfer';
import TransferInternal from './pages/SignIn/Transfer/TransferInternal';
import TransferExternal from './pages/SignIn/Transfer/TransferExternal';
import DebtList from './pages/SignIn/Debt/DebtList';

import NotFound from './pages/NotFound';

const GuestRoute = ({ element, redirectTo }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to={redirectTo} /> : element;
};

const AuthenticatedRoute = ({ element, redirectTo }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? element : <Navigate to={redirectTo} />;
};

function GuestLayout() {
  return (
    <div className="h-screen">
      {/* <Header /> */}
      <Outlet />
    </div>
  );
}

function AuthenticatedLayout() {
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
            <GuestRoute element={<GuestLayout />} redirectTo="/account" />
          }
        >
          <Route path="home" element={<Home />} />
        </Route>
        <Route
          path="login"
          element={<GuestRoute element={<Login />} redirectTo="/account" />}
        />

        <Route path="/" element={<AuthenticatedRoute element={<AuthenticatedLayout />} redirectTo="/home" />}>
          <Route path="account" element={<Account />} />
          <Route path="transfer" element={<Transfer />} />
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
