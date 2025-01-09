import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import OtpInputs from '../OtpInputs';

import { BASE_URL, FAILED, INTERNAL_BAND_ID, LOADING, SENDER, SUCCEEDED } from '../../util/config';
import { getAccessToken } from '../../util/cookie';
import { payDebt } from '../../redux/debtThunk';
import { createExternalTransactions, createInternalTransactions } from '../../redux/transactionThunk';
import { setTransactionStatus } from '../../redux/transactionSlice';



export default function TransferStep3({ setCurrentStep, values, setTransaction, transaction, debt }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [invalidOtp, setInvalidOtp] = useState(false);
  const { email } = useSelector((state) => state.user)
  const access_token = getAccessToken();

  const dispatch = useDispatch();

  const handleSuccessfulTransaction = (transaction) => {
    // console.log("handleSuccessfulTransaction:", transaction)
    setTransaction(transaction)
    dispatch(payDebt({ id_debt: debt.id, data: { id_transaction: transaction.id } }))
    setCurrentStep(4)
  }

  const handleConfirm = async () => {
    const otpValue = otp.join("");
    console.log("OTP Value:", otpValue);

    dispatch(setTransactionStatus({
      status: LOADING
    }));
    const response = await fetch(`${BASE_URL}/otp/verify`, {
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

    if (!response.ok) {
      dispatch(setTransactionStatus({
        status: FAILED,
        error: "OTP không hợp lê hoặc hết hạn"
      }));
      setInvalidOtp(true);
      return
    }

    const result = await response.json();
    if (result.data) {
      console.log(result.data)
      const newValues = {
        ...values,
        transaction_amount: values.fee_payment_method === SENDER ? Number(values.transaction_amount) + 1000 : Number(values.transaction_amount) - 1000
      }

  
      if (newValues.id_recipient_bank == INTERNAL_BAND_ID){
        dispatch(createInternalTransactions({
          data: newValues,
          handleSuccessfulTransaction,
        }))
      } else {
        dispatch(createExternalTransactions({
          data: newValues,
          handleSuccessfulTransaction,
        }))
      }
    }
  }

  // useEffect(() => {
  //   if (debt && transaction) {
  //     console.log("pay debt")
  //     console.log(transaction, debt)
  //   }
  // }, [transaction])

  return (
    <>
      <div className="w-8/12 mx-auto p-6 flex flex-col bg-white rounded-xl space-y-6 pt-8 ">
        <OtpInputs setOtp={setOtp} otp={otp} />

        <div className="flex justify-center space-x-4 pt-4">
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="px-4 py-2 bg-white text-red-800 border-2 border-red-800 rounded-xl 
            hover:bg-red-100"
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

      {
        invalidOtp && (
          <></>
        )
      }
    </>
  );
}
