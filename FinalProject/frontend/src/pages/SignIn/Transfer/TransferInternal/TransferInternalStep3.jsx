import React, { useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SENDER } from '../../../../util/config';


export default function TransferInternalStep3({ setCurrentStep, values, setTransaction }) {
  const handleConfirm = () => {
    // call api

    setTransaction(null)
    setCurrentStep(4)
  }

  return (
    <>
      <div className="w-8/12 mx-auto p-6 flex flex-col bg-white rounded-lg space-y-6 pt-8 ">
        

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
