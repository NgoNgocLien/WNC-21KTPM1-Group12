import React, { useState} from 'react';
import { useSelector } from 'react-redux';

import OtpInputs from '../../../../components/OtpInputs';

import { BASE_URL, SENDER } from '../../../../util/config';
import { getAccessToken } from '../../../../util/cookie';



export default function TransferInternalStep3({ setCurrentStep, values, setTransaction }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [invalidOtp, setInvalidOtp] = useState(false);
  const {email} = useSelector((state) => state.user)
  const access_token = getAccessToken();

  const makeTransaction = async () => {
    const newValues = {
      ...values,
      transaction_amount: values.fee_payment_method === SENDER ? values.transaction_amount + 1000 : values.transaction_amount - 1000
    }

    const transaction = await fetch (`${BASE_URL}/transactions/internal`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`, 
      },
      body: JSON.stringify(newValues)
    })

    if (!transaction.ok){
      throw new Error('Failed to fetch user account info');
    } else {
      const result = await transaction.json();
      setTransaction(result.data)
      setCurrentStep(4)
    }
  }

  const handleConfirm = async () => {
    const otpValue = otp.join("");
    console.log("OTP Value:", otpValue);
    
    const response = await fetch(`${BASE_URL}/otp/verify`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`, 
      },
      body: JSON.stringify({
          email,
          otp: otpValue
      })
    })

    if (!response.ok){
      throw new Error('Failed to fetch user account info');
    }

    const result = await response.json();
    if (result.data){
      await makeTransaction();
    } else {
      setInvalidOtp(true);
    }
  }

  return (
    <>
      <div className="w-8/12 mx-auto p-6 flex flex-col bg-white rounded-lg space-y-6 pt-8 ">
        <OtpInputs setOtp={setOtp} otp={otp} />

        <div className="flex justify-center space-x-4 pt-4">
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="px-4 py-2 bg-white text-red-800 border-2 border-red-800 rounded-lg 
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

      {
        invalidOtp && (
          <></>
        )
      }
    </>
  );
}
