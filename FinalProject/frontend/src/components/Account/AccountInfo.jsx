import React from 'react';
import { useSelector } from 'react-redux';
import BalanceDisplay from './BalanceDisplay'

export default function AccountInfo() {
  const {account_number, balance} = useSelector((state) => state.user)
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
        </div>
    </>
  )
}