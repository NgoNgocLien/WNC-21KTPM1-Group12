import './App.css';
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate, useParams } from 'react-router-dom';

import Home from './pages/Guest/Home';
import Login from './pages/Guest/Login';

import Sidebar from './components/Sidebar';

import Account from './pages/SignIn/Customer/Account';
import Transfer from './pages/SignIn/Customer/Transfer/Transfer';
import TransferInternal from './pages/SignIn/Customer/Transfer/TransferInternal';
import TransferExternal from './pages/SignIn/Customer/Transfer/TransferExternal';
import DebtList from './pages/SignIn/Customer/Debt/DebtList';

import CustomerMgmt from './pages/SignIn/Employee/CustomerMgmt';
import CustomerTransferHistory from './pages/SignIn/Employee/CustomerTransferHistory';

import EmployeeMgmt from './pages/SignIn/Admin/EmployeeMgmt';
import BankTransferHistory from './pages/SignIn/Admin/BankTransferHistory';

import NotFound from './pages/NotFound';

import { getAccessToken, getRoleFromToken } from './util/cookie';


const GuestRoute = ({ element }) => {
  const isAuthenticated = getAccessToken();
  if (isAuthenticated){
    const role = getRoleFromToken();
    switch(role){
      case 'customer':
        return <Navigate to={'/customer'} /> ;
      case 'employee':
        return <Navigate to={'/employee'} /> ;
      case 'admin':
      default:
        return <Navigate to={'/admin'} /> ;
    }
  } else
    return element;
};

const AuthenticatedRoute = ({ element, redirectTo }) => {
  const isAuthenticated = getAccessToken();
  return isAuthenticated ? element : <Navigate to={redirectTo} />;
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
  return (
    <div>
      <Sidebar />
      <main className="ms-80 p-8 flex flex-col gap-4 bg-red-50 overflow-auto">
        <Outlet />
      </main>
      
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="login/:role" element={<GuestRoute element={<Login />}/>} />
        <Route path="home" element={<GuestRoute element={<Home />}  />} />

        <Route path="/customer" element={<CustomerRoute element={<AuthenticatedLayout />} redirectTo="/home" />}>
          <Route index element={<Navigate to="/customer/transfer" />} />
          <Route path="account" element={<Account />} />
          <Route path="transfer" element={<Transfer />} />
          <Route path="transfer-internal" element={<TransferInternal />} />
          <Route path="transfer-external" element={<TransferExternal />} />
          <Route path="debt" element={<DebtList />} />
        </Route>

        <Route path="/employee" element={<EmployeeRoute element={<AuthenticatedLayout />} redirectTo="/home" />}>
          <Route index element={<Navigate to="/employee/customer-mgmt" />} />
          <Route path="customer-mgmt" element={<CustomerMgmt />} />
          <Route path="transfer-history" element={<CustomerTransferHistory />} />
        </Route>

        <Route path="/admin" element={<AdminRoute element={<AuthenticatedLayout />} redirectTo="/home" />}>
          <Route index element={<Navigate to="/admin/employee-mgmt" />} />
          <Route path="employee-mgmt" element={<EmployeeMgmt />} />
          <Route path="transfer-history" element={<BankTransferHistory />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
