import React from 'react';
import { useSelector } from 'react-redux';
// import { FaMoneyBillAlt, FaExchangeAlt, FaRegCreditCard } from 'react-icons/fa';
import { ArrowsRightLeftIcon, BanknotesIcon, CreditCardIcon } from '@heroicons/react/24/outline';

export default function TransferTab() {
  return (
    <>
      <p className="text-lg font-semibold">Lịch sử giao dịch</p>

      <div className="p-4 bg-white rounded-lg">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold text-red-800">147 giao dịch</p>
          <div className="flex space-x-2">
            <button className="flex items-center gap-2 p-2 h-fit rounded-lg bg-green-500 text-white">
              <BanknotesIcon className='w-6 h-6 p-0 m-0' />
              Nhận tiền
            </button>
            <button className="flex items-center gap-2 p-2 h-fit rounded-lg bg-yellow-500 text-white">
              <ArrowsRightLeftIcon className='w-6 h-6 p-0 m-0' />
              Chuyển tiền
            </button>
            <button className="flex items-center gap-2 p-2 h-fit rounded-lg bg-blue-500 text-white">
              <CreditCardIcon className='w-6 h-6 p-0 m-0' />
              Thanh toán nợ
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
