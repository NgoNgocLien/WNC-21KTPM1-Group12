import React from 'react';
import { useSelector } from 'react-redux';
import { FaMoneyBillAlt, FaExchangeAlt, FaRegCreditCard } from 'react-icons/fa';

export default function TransferTab() {
  return (
    <>
        <p className="text-lg font-semibold">Lịch sử giao dịch</p>

        <div className="p-4 bg-white rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold text-red-800">147 giao dịch</p>
              <div className="flex space-x-2">
                <button className="flex items-center gap-2 p-2 h-fit bg-white rounded-lg bg-green-500 text-white">
                  <FaMoneyBillAlt />  
                  Nhận tiền
                </button>
                <button className="flex items-center gap-2 p-2 h-fit bg-white rounded-lg bg-yellow-500 text-white">
                  <FaExchangeAlt />
                  Chuyển tiền
                </button>
                <button className="flex items-center gap-2 p-2 h-fit bg-white rounded-lg bg-blue-500 text-white">
                  <FaRegCreditCard />
                  Thanh toán nợ
                </button>
              </div>
            </div>
        </div>
    </>
  )
}
