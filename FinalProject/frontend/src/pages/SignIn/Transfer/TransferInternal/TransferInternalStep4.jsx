import React, { useState} from 'react';
import { HiCheckBadge } from "react-icons/hi2";

import { SENDER } from '../../../../util/config';
import { useNavigate } from 'react-router-dom';


export default function TransferInternalStep4({ setCurrentStep, transaction }) {
  const navigate = useNavigate();

  const handleAddOneContact = () => {

  }

  // console.log(transaction)
  return (
    <>
      <div className="relative w-8/12 h-screen h-fit mx-auto flex flex-col rounded-lg bg-white">
      
        <div className="absolute w-full h-full inset-0 p-6 pt-8 z-40">
          <div className="self-center flex flex-col items-center text-green-400">
            <HiCheckBadge size={80}/>
            <p className="font-semibold text-black mt-3">Giao dịch thành công</p>
            <p className="font-semibold text-2xl text-red-800 mt-1">{Number(transaction.transaction_amount).toLocaleString()} VNĐ</p>
            <p className="text-gray-400">MGD: {transaction.id}</p>
          </div>

          <div className="flex justify-between space-x-4 pt-4">
            <div>
            <button
              type="button"
              onClick={() => navigate("/transfer")}
              className="px-4 py-2 bg-white text-red-800 border-2 border-red-800 rounded-lg 
              disabled:bg-gray-200 disabled:text-gray-400 disabled:border-none"
            >
              Lưu người nhận
            </button>
            </div>
            <div className="flex justify-between space-x-4">
            <button
              type="button"
              onClick={() => navigate("/transfer")}
              className="px-4 py-2 bg-white text-red-800 border-2 border-red-800 rounded-lg 
              disabled:bg-gray-200 disabled:text-gray-400 disabled:border-none"
            >
              Giao dịch khác
            </button>
            <button
              onClick={() => navigate("/account")}
              className="px-4 py-2 bg-red-800 text-white rounded-lg disabled:bg-gray-200 disabled:text-gray-400"
            >
              Về trang tài khoản
            </button>
          </div>
          
        </div>
        </div>

        <div className="absolute w-full h-full inset-0 z-10">
          <img 
            src="bg-bill.png" 
            alt="background" 
            className=" w-full h-full object-cover"
            style={{
              maskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)',
            }}
          />
        </div>
        
        
        
        
        {/* <div className="w-full flex justify-between">
          <div className="w-5/12 text-gray-500">
            Tài khoản nguồn
          </div>
          <div className="w-6/12 font-semibold">
            {values.sender_account_number}
          </div>
        </div>
        
        <div className="w-full flex justify-between">
          <div className="w-5/12 text-gray-500">
            Tài khoản thụ hưởng
          </div>
          <div className="w-6/12 font-semibold">
            {values.recipient_account_number}
          </div>
        </div>

        <div className="w-full flex justify-between">
          <div className="w-5/12 text-gray-500">
            Tên người thụ hưởng
          </div>
          <div className="w-6/12 font-semibold text-red-800">
            {values.recipient_name}
          </div>
        </div>

        <div className="w-full flex justify-between">
          <div className="w-5/12 text-gray-500">Số tiền</div>
          <div className="w-6/12 font-semibold">
            {Number(values.transaction_amount).toLocaleString()} VNĐ
          </div>
        </div>

        <div className="w-full flex justify-between">
          <div className="w-5/12 text-gray-500">Phí giao dịch</div>
          <div className="w-6/12 font-semibold">
            1,000 VNĐ
          </div>
        </div>

        <div className="w-full flex justify-between">
          <div className="w-5/12 text-gray-500">Người thanh toán phí giao dịch</div>
          <div className="w-6/12 font-semibold">
            <div className="flex items-center space-x-4">
              {values.fee_payment_method === SENDER ? 'Người gửi' : 'Người nhận'}
            </div>
          </div>
        </div>

        <div className="w-full flex justify-between">
          <div className="w-5/12 text-gray-500">Tổng tiền</div>
          <div className="w-6/12 font-semibold text-red-800">
            {values.fee_payment_method === SENDER 
              ? Number(values.transaction_amount + 1000).toLocaleString() 
              : Number(values.transaction_amount - 1000).toLocaleString() 
            } VNĐ
            
          </div>
        </div>

        <div className="w-full flex justify-between">
          <div className="w-5/12 text-gray-500">Nội dung chuyển tiền</div>
          <div className="w-6/12 font-semibold">
            {values.transaction_message}
          </div>
        </div> */}


      </div>
    </>
  );
}
