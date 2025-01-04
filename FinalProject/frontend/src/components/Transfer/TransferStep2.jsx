import React from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL, SENDER } from '../../util/config';
import { getAccessToken } from '../../util/cookie';


export default function TransferStep2({ setCurrentStep, values }) {
  const {email} = useSelector((state) => state.user)
  const access_token = getAccessToken();

  const handleConfirm = async () => {
    setCurrentStep(3);
    await fetch(`${BASE_URL}/otp/send`,{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`, 
      },
      body: JSON.stringify({
          email
      })
    })
  }

  return (
    <>
      <div className="w-8/12 mx-auto p-6 flex flex-col bg-white rounded-xl space-y-6 pt-8 ">
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
              ? Number(Number(values.transaction_amount) + 1000).toLocaleString() 
              : Number(Number(values.transaction_amount) - 1000).toLocaleString() 
            } VNĐ
            
          </div>
        </div>

        <div className="w-full flex justify-between">
          <div className="w-5/12 text-gray-500">Nội dung chuyển tiền</div>
          <div className="w-6/12 font-semibold">
            {values.transaction_message}
          </div>
        </div>

        <div className="flex justify-center space-x-4 pt-4 mt-8">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 bg-while-200 text-red-800 border-2 border-red-800 rounded-xl hover:bg-red-100"
            >
              Quay lại
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-800 text-white rounded-xl hover:bg-red-700"
            >
              Xác nhận
            </button>
          </div>
      </div>
    </>
  );
}
