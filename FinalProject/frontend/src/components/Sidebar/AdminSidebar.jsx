import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import { ArrowRightStartOnRectangleIcon, UserGroupIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { clearToken } from '../../util/cookie';
import AdminService from './../../services/AdminService'
import { getUserInfo } from '../../redux/userThunk';
import { useDispatch, useSelector } from 'react-redux';

const AdminSidebar = () => {
  const dispatch = useDispatch()
  const {id, username} = useSelector((state) => state.user)

  useEffect( () => {
      if (id == 0){
        dispatch(getUserInfo("admin"))
      }
    }, []);

  const handleLogout = () => {
    clearToken();
    logout();
    window.location.href = "/"
  };

  return (
    <div className="fixed h-screen w-80 p-3">
      <div className="h-full w-full bg-red-800 text-white font-semibold flex flex-col justify-between rounded-xl">
        <div className='px-4 flex flex-col gap-5'>
          <h1 className="text-3xl text-center mt-5">NoMeoBank</h1>
          <div className="text-center">
            <div className="p-4 bg-red-900 rounded-xl">
              <div className="flex items-center justify-center p-4">
                <img
                  src={`${process.env.PUBLIC_URL}/logo.jpg`}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-2 border-white"
                />
              </div>
              <p className="text-xl">{username}</p>
            </div>
          </div>

          <nav className="w-full mx-auto flex flex-col gap-3 text-black font-semibold text-md">

            <NavLink
              to="/admin/employee-mgmt"
              className="bg-white py-3 px-4 rounded-xl transition duration-200 flex items-center justify-start gap-x-3 hover:text-red-800"
            >
              <div className="flex size-8 flex-none items-center justify-center rounded-3xl bg-red-800 group-hover:bg-white">
                <UserGroupIcon className="size-5 text-white group-hover:text-red-800" />
                
              </div>
              Quản lý nhân viên
            </NavLink>

            <NavLink
              to="/admin/transfer-history"
              className="bg-white py-3 px-4 rounded-xl transition duration-200 flex items-center justify-start gap-x-3 hover:text-red-800"
            >
              <div className="flex size-8 flex-none items-center justify-center rounded-3xl bg-red-800 group-hover:bg-white">
                <CalendarDaysIcon className="size-5 text-white group-hover:text-red-800" />
                
              </div>
              Lịch sử giao dịch
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

export default AdminSidebar;
