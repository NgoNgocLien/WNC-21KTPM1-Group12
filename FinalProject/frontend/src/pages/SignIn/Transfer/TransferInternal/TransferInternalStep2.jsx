import React, { useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SENDER } from '../../../../util/config';


export default function TransferInternalStep2({ setCurrentStep, values }) {
  const handleConfirm = () => {
    // send otp

    setCurrentStep(3)
  }

  return (
    <>
      <div className="w-8/12 mx-auto p-6 flex flex-col bg-white rounded-lg space-y-6 pt-8 ">
        <div className="w-full flex justify-between">
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
        </div>

        <div className="flex justify-center space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 bg-while-200 text-red-800 border-2 border-red-800 rounded-lg 
              disabled:bg-gray-200 disabled:text-gray-400 disabled:border-none"
            >
              Quay lại
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-800 text-white rounded-lg disabled:bg-gray-200 disabled:text-gray-400"
            >
              Xác nhận
            </button>
          </div>
      </div>
    </>
  );
}
