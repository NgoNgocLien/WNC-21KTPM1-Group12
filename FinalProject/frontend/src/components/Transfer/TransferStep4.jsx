import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HiCheckBadge } from "react-icons/hi2";

import { SENDER, INTERNAL_BAND_NAME } from '../../util/config';
import { formatTime } from '../../util/format';


export default function TransferStep4({ setIsAddModalOpen, transaction }) {
  const {fullname, contacts} = useSelector((state) => state.user)
  const navigate = useNavigate();
  const [isExistingInContact, setIsExistingInContact] = useState(false)
  useEffect(()=>{
    if (transaction){
      const result = contacts?.some((contact) => {
        // console.log(contact.account_number)
        // console.log(transaction.recipient_account_number)
        return contact.account_number === transaction.recipient_account_number
      })
      // console.log(result);
      setIsExistingInContact(result);
    }
  }, [transaction, contacts])

  return (
    <>
      <div className="relative w-8/12 h-fit mx-auto flex flex-col rounded-xl bg-white">
      
        <div className="relative w-full h-full top-0 p-6 pt-8 z-10">
          <div className="self-center flex flex-col items-center text-green-400">
            <HiCheckBadge size={80} />
            <p className="font-semibold text-black mt-3">Giao dịch thành công</p>
            <p className="font-semibold text-2xl text-red-800 mt-1">{Number(transaction.transaction_amount).toLocaleString()} VNĐ</p>
            <p className="text-gray-400 mt-1">MGD: {transaction.id}</p>
          </div>

          <div className="flex flex-col gap-4 my-8">
            <div className="w-full flex justify-between">
              <div className="w-5/12 text-gray-500">
                Thông tin tài khoản chuyển
              </div>
              <div className="w-6/12 flex flex-col gap-0">
                <p className="font-semibold">{fullname}</p>
                <p>{INTERNAL_BAND_NAME}</p>
                <p>{transaction.sender_account_number}</p>
              </div>
            </div>

            <div className="w-full flex justify-between">
              <div className="w-5/12 text-gray-500">
                Thông tin tài khoản thụ hưởng
              </div>
              <div className="w-6/12 flex flex-col gap-0">
                <p className="font-semibold">{transaction.recipient_name}</p>
                <p>{INTERNAL_BAND_NAME}</p>
                <p>{transaction.recipient_account_number}</p>
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
                  {transaction.fee_payment_method === SENDER ? 'Người gửi' : 'Người nhận'}
                </div>
              </div>
            </div>


            <div className="w-full flex justify-between">
              <div className="w-5/12 text-gray-500">Nội dung chuyển tiền</div>
              <div className="w-6/12 font-semibold">
                {transaction.transaction_message}
              </div>
            </div>

            <div className="w-full flex justify-between">
              <div className="w-5/12 text-gray-500">Thời gian giao dịch</div>
              <div className="w-6/12 font-semibold">
                <div className="flex items-center space-x-4">
                  {formatTime(transaction.transaction_time)}
                </div>
              </div>
            </div>
          </div>

          <div className={`flex ${isExistingInContact ? 'justify-center' : 'justify-between'} space-x-4 pt-4`}>
            
              {
                !isExistingInContact && (
                  <div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true) }
                  className="px-4 py-2 bg-white text-red-800 border-2 border-red-800 rounded-xl hover:bg-red-100"
                >
                  Lưu người nhận
                </button>
                </div>
                )
              }
            
            <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => navigate("/transfer")}
              className="px-4 py-2 bg-white text-red-800 border-2 border-red-800 rounded-xl hover:bg-red-100"
              >
                Giao dịch khác
              </button>
              <button
                onClick={() => navigate("/account")}
                className="px-4 py-2 bg-red-800 text-white rounded-xl hover:bg-red-700"
              >
                Về trang tài khoản
              </button>
            </div>

          </div>
        </div>

        <div className="absolute w-full h-full top-0 z-0">
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
      </div>
    </>
  );
}
