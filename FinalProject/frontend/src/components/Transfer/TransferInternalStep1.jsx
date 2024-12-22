import React from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import TransferAccount from './TransferAccount';
import { SENDER, RECIPIENT, INTERNAL_BAND_ID } from '../../util/config';
import getFullname from '../../util/getFullname';
import { getAccessToken } from '../../util/cookie';

export default function TransferInternalStep1({ setCurrentStep, setValues }) {
  const { account_number, balance } = useSelector((state) => state.user);
  const access_token = getAccessToken();
  
  const formik = useFormik({
    initialValues: {
      sender_account_number: account_number,
      id_sender_bank: INTERNAL_BAND_ID,
      recipient_account_number: '',
      id_recipient_bank: INTERNAL_BAND_ID,
      transaction_amount: null,
      transaction_message: '',
      fee_payment_method: SENDER,
      recipient_name: '',
    },
    validationSchema: Yup.object({
      transaction_amount: Yup.number()
        .required('Số tiền giao dịch là bắt buộc')
        .min(5000, 'Số tiền giao dịch tối thiểu là 5000')
        .max(balance, `Số tiền giao dịch không được vượt quá số dư ${balance}`),
      recipient_account_number: Yup.string().required('Tài khoản thụ hưởng là bắt buộc'),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      setValues(values)
      setCurrentStep(2);
      resetForm();
    },
  });

  
  const handleAccountNumberBlur = async (e) => {
    formik.handleBlur(e);
    const account_number = e.target.value;
    if (account_number) {
      const bank_id = 1;
      const recipient_name = await getFullname(access_token,account_number, bank_id);
      formik.setFieldValue('recipient_name', recipient_name);
    }
  };

  return (
    <>
      <TransferAccount formik={formik} />

      <div className="w-8/12 mx-auto p-6 flex flex-col bg-white rounded-lg space-y-4 ">
        <div className="w-full flex justify-between items-center">
          <div className="w-3/12 font-semibold">
            Tài khoản thụ hưởng
          </div>
          <div className="w-7/12">
            <input
              type="text"
              name="recipient_account_number"
              value={formik.values.recipient_account_number}
              onChange={formik.handleChange}
              onBlur={handleAccountNumberBlur}
              className="w-full border-2 p-2 rounded-lg"
            />
            {formik.touched.recipient_account_number && formik.errors.recipient_account_number && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.recipient_account_number}</div>
            )}
          </div>
        </div>

        {
          formik.values.recipient_name && (
            <div className="w-full flex justify-between items-center">
              <div className="w-3/12 font-semibold">Tên người thụ hưởng</div>
              <div className="w-7/12 ">
                {formik.values.recipient_name}
              </div>
            </div>
          )
        }
        
        <div className="w-full flex justify-between items-center">
          <div className="w-3/12 font-semibold">Số tiền</div>
          <div className="w-7/12 ">
            <div className="flex items-center">
              <input
                  type="number"
                  name="transaction_amount"
                  value={formik.values.transaction_amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border-2 p-2 rounded-lg"
                />
               <p className="ms-2">VNĐ</p>
            </div>
            
            {formik.touched.transaction_amount && formik.errors.transaction_amount && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.transaction_amount}</div>
            )}
          </div>
        </div>

        <div className="w-full flex justify-between items-center">
          <div className="w-3/12 font-semibold">Nội dung chuyển tiền</div>
          <div className="w-7/12 ">
            <input
              type="text"
              name="transaction_message"
              value={formik.values.transaction_message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border-2 p-2 rounded-lg"
            />
          </div>
        </div>

        <div className="w-full flex justify-between items-center">
          <div className="w-3/12 font-semibold">Phí giao dịch</div>
          <div className="w-7/12 ">
           {Number(1000).toLocaleString()} VNĐ
          </div>
        </div>

        <div className="w-full flex justify-between items-center">
          <div className="w-3/12 font-semibold">Người thanh toán phí giao dịch</div>
          <div className="w-7/12 ">
            <div className="flex items-center space-x-4">
              <label className="w-1/2 flex items-center">
                <input
                  type="radio"
                  name="fee_payment_method"
                  value={SENDER}
                  checked={formik.values.fee_payment_method === SENDER}
                  onChange={formik.handleChange}
                  className="mr-2 peer appearance-none w-3 h-3 border-2 border-gray-400 rounded-full checked:border-red-800 checked:bg-red-800"
                />
                Người gửi
              </label>
              <label className="w-1/2 flex items-center">
                <input
                  type="radio"
                  name="fee_payment_method"
                  value={RECIPIENT}
                  checked={formik.values.fee_payment_method === RECIPIENT}
                  onChange={formik.handleChange}
                  className="mr-2 peer appearance-none w-3 h-3 border-2 border-gray-400 rounded-full checked:border-red-800 checked:bg-red-800"
                />
                Người nhận
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          onClick={formik.handleSubmit}
          // disabled={!formik.isValid || formik.isSubmitting}
          className="w-fit self-center px-4 py-2 mt-2 bg-red-800 text-white rounded-lg disabled:bg-gray-200 disabled:text-gray-400"
        >
          Tiếp tục
        </button>
      </div>
    </>
  );
}
