import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from './../redux/authSlice'
import { reset } from './../redux/userSlice'
import { fetchUserAccountInfo } from './../redux/userThunk';
import { IDLE, LOADING, FAILED } from './../util/config'
import { ArrowRightStartOnRectangleIcon, ArrowsRightLeftIcon, ArrowUpTrayIcon, BanknotesIcon, BuildingLibraryIcon, CreditCardIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { clearToken } from '../util/cookie';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { account_number, fullname, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (account_number === '')
      dispatch(fetchUserAccountInfo());

  }, [status, dispatch]);

  // if (status === LOADING) return <p>Loading...</p>;
  // if (status === FAILED) return <p className="text-red-500">Error: {error}</p>;

  const handleLogout = () => {
    clearToken();
    window.location.href = "/"
  };
  return (
    <div className="fixed h-screen w-80 p-3">
      <div className="h-full w-full bg-red-800 text-white font-semibold flex flex-col justify-between rounded-2xl">
        <div className='px-4 flex flex-col gap-5'>
          <h1 className="text-3xl text-center mt-5">NoMeoBank</h1>
          <div className="text-center">
            <div className="p-4 bg-red-900 rounded-xl">
              <div className="flex items-center justify-center p-4">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-2 border-white"
                />
              </div>
              <p className="text-xl">{fullname}</p>
              <p className="text-slate-300">STK: {account_number}</p>
            </div>
          </div>

          <nav className="w-full mx-auto flex flex-col gap-3 text-black font-semibold text-md">

            <NavLink
              to="/transfer"
              className="bg-white py-3 px-4 rounded-xl transition duration-200 flex items-center justify-start gap-x-3 hover:text-red-800"
            >
              <div className="flex size-8 flex-none items-center justify-center rounded-3xl bg-red-800 group-hover:bg-white">
                <ArrowsRightLeftIcon className="size-5 text-white group-hover:text-red-800" />
              </div>
              Chuyển tiền
            </NavLink>

            <NavLink
              to="/debt"
              className="bg-white py-3 px-4 rounded-xl transition duration-200 flex items-center justify-start gap-x-3 hover:text-red-800"
            >
              <div className="flex size-8 flex-none items-center justify-center rounded-3xl bg-red-800 group-hover:bg-white">
                <CreditCardIcon className="size-5 text-white group-hover:text-red-800" />
              </div>
              Nhắc nợ
            </NavLink>

            <NavLink
              to="/account"
              className="bg-white py-3 px-4 rounded-xl transition duration-200 flex items-center justify-start gap-x-3 hover:text-red-800"
            >
              <div className="flex size-8 flex-none items-center justify-center rounded-3xl bg-red-800 group-hover:bg-white">
                <BuildingLibraryIcon className="size-5 text-white group-hover:text-red-800" />
              </div>
              Tài khoản
            </NavLink>

          </nav>
        </div>
        <nav className="mb-4 w-fit mx-auto">
          <NavLink
            onClick={handleLogout}
            className="flex gap-x-2 items-center justify-center py-2 px-4 border-2 rounded-xl transition duration-200"
          >
            <ArrowRightStartOnRectangleIcon className="size-5" />
            Đăng xuất
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
