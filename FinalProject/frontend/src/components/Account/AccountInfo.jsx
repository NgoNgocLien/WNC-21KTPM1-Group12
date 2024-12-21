import React from 'react';
import { useSelector } from 'react-redux';
import BalanceDisplay from './BalanceDisplay'

export default function AccountInfo() {
  const {account_number, balance, fullname, email, username, phone} = useSelector((state) => state.user)
  return (
    <>
        <p className="text-lg font-semibold">Thông tin tài khoản</p>

        <div className="p-4 bg-white rounded-lg ">
          <div className="p-[2px] flex rounded-lg bg-gradient-to-r from-red-900 to-red-200 ">
            <div className="w-1/2 p-4 bg-white rounded-l-lg">
              <h3 className="text-gray-500">
                Tài khoản thanh toán
              </h3>
              <p>
                {account_number}
              </p>
            </div>
            <div className="w-1/2 p-4 bg-white rounded-r-lg">
              <h3 className="text-gray-500">
                Số dư khả dụng
              </h3>
              <BalanceDisplay balance={balance}/>
            </div>
          </div>

          <div className="p-[2px] flex rounded-lg  ">
            <div className="w-1/2 p-4 bg-white rounded-l-lg">
              <h3 className="text-gray-500">
                Họ và tên
              </h3>
              <p>
                {fullname}
              </p>
            </div>
            <div className="w-1/2 p-4 bg-white rounded-r-lg">
              <h3 className="text-gray-500">
                Số điện thoại
              </h3>
              <p>
                {phone}
              </p>
            </div>
          </div>

          <div className="p-[2px] flex rounded-lg  ">
            <div className="w-1/2 p-4 bg-white rounded-l-lg">
              <h3 className="text-gray-500">
                Tên đăng nhập
              </h3>
              <p>
                {username}
              </p>
            </div>
            <div className="w-1/2 p-4 bg-white rounded-r-lg">
              <h3 className="text-gray-500">
                Email
              </h3>
              <p>
                {email}
              </p>
            </div>
          </div>
        </div>

        <button className="w-fit px-4 py-2 bg-red-800 text-white rounded-lg">
          Đổi mật khẩu
        </button>
    </>
  )
}
