import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import Home from './pages/Guest/Home';
import Login from './pages/Guest/Login';

import CustomerSidebar from './components/Sidebar/CustomerSidebar';
import EmployeeSidebar from './components/Sidebar/EmployeeSidebar';
import AdminSidebar from './components/Sidebar/AdminSidebar';
import Dialog from './components/Dialog';
import LoadingIndicator from './components/LoadingIndicator';

import Account from './pages/SignIn/Customer/Account';
import Transfer from './pages/SignIn/Customer/Transfer/Transfer';
import TransferInternal from './pages/SignIn/Customer/Transfer/TransferInternal';
import TransferExternal from './pages/SignIn/Customer/Transfer/TransferExternal';
import DebtList from './pages/SignIn/Customer/Debt/DebtList';

import CustomerMgmt from './pages/SignIn/Employee/CustomerMgmt';

import EmployeeMgmt from './pages/SignIn/Admin/EmployeeMgmt';
import BankTransferHistory from './pages/SignIn/Admin/BankTransferHistory';

import NotFound from './pages/NotFound';

import { login } from './redux/authSlice';
import { getAccessToken, getRoleFromToken } from './util/cookie';
import { onMessageListener } from './util/fcm';
import { SUCCEEDED } from './util/config'
import notify from './util/notification';
import { fetchIncomingDebts, fetchOutgoingDebts } from './redux/debtThunk';


const GuestRoute = ({ element }) => {
  const isAuthenticated = getAccessToken();
  if (isAuthenticated) {
    const role = getRoleFromToken();
    switch (role) {
      case 'customer':
        return <Navigate to={'/customer'} />;
      case 'employee':
        return <Navigate to={'/employee'} />;
      case 'admin':
      default:
        return <Navigate to={'/admin'} />;
    }
  } else
    return element;
};

const CustomerRoute = ({ element, redirectTo }) => {
  const isCustomer = getRoleFromToken();
  return (isCustomer === "customer") ? element : <Navigate to={redirectTo} />;
};

const EmployeeRoute = ({ element, redirectTo }) => {
  const isEmployee = getRoleFromToken();
  return (isEmployee === "employee") ? element : <Navigate to={redirectTo} />;
};

const AdminRoute = ({ element, redirectTo }) => {
  const isAdmin = getRoleFromToken();
  return (isAdmin === "admin") ? element : <Navigate to={redirectTo} />;
};

function AuthenticatedLayout() {
  const { role } = useSelector((state) => state.auth)
  let sidebar = null;

  switch (role) {
    case 'customer':
      sidebar = <CustomerSidebar />;
      break;
    case 'employee':
      sidebar = <EmployeeSidebar />;
      break;
    case 'admin':
      sidebar = <AdminSidebar />;
      break;
    default:
      break;
  }
  const dispatch = useDispatch();

  onMessageListener().then((payload) => {
    console.log('Message received. ', payload);
    notify(payload.notification.title, payload.notification.body);

    dispatch(fetchIncomingDebts());
    dispatch(fetchOutgoingDebts())
  });

  return (
    <>
      {sidebar}
      <ToastContainer />
      {/* <PopupNoti /> */}
      <main className="ms-80 p-8 flex flex-col gap-4 bg-red-50 overflow-auto">
        <Outlet />
      </main>
    </>
  );
}

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const role = getRoleFromToken();
    if (role) {
      dispatch(login({
        role: role,
        status: SUCCEEDED,
        error: null
      }));
    }
  }, [dispatch]);

  return (
    <>
      <LoadingIndicator />
      <Dialog />

      <Router>
        <Routes>
          <Route path="login/:role" element={<GuestRoute element={<Login />} />} />
          <Route path="" element={<GuestRoute element={<Home />} />} />

          <Route path="/customer" element={<CustomerRoute element={<AuthenticatedLayout />} redirectTo="/" />}>
            <Route index element={<Navigate to="/customer/transfer" />} />
            <Route path="account" element={<Account />} />
            <Route path="transfer" element={<Transfer />} />
            <Route path="transfer-internal" element={<TransferInternal />} />
            <Route path="transfer-external" element={<TransferExternal />} />
            <Route path="debt/:id_debt" element={<DebtList />} />
            <Route path="debt" element={<DebtList />} />
          </Route>

          <Route path="/employee" element={<EmployeeRoute element={<AuthenticatedLayout />} redirectTo="/" />}>
            <Route index element={<Navigate to="/employee/customer-mgmt" />} />
            <Route path="customer-mgmt" element={<CustomerMgmt />} />
          </Route>

          <Route path="/admin" element={<AdminRoute element={<AuthenticatedLayout />} redirectTo="/" />}>
            <Route index element={<Navigate to="/admin/employee-mgmt" />} />
            <Route path="employee-mgmt" element={<EmployeeMgmt />} />
            <Route path="transfer-history" element={<BankTransferHistory />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
