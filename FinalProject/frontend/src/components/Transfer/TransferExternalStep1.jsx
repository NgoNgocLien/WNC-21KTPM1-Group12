import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaAddressBook } from "react-icons/fa";

import TransferAccount from './TransferAccount';
import ContactList from '../Account/ContactList';
import ExternalBankSelect from './ExternalBankSelect';

import { getCustomerContacts } from '../../redux/userThunk';
import { SENDER, RECIPIENT, LOADING, SUCCEEDED, FAILED } from '../../util/config';
import { getAccessToken } from '../../util/cookie';
import CustomerService from '../../services/CustomerService';
import { setUserStatus } from '../../redux/userSlice';


export default function TransferInternalStep1({ setCurrentStep, setValues }) {
  const { account_number, balance, contacts, fullname } = useSelector((state) => state.user);
  const [ displayContacts, setDisplayContacts ] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      sender_account_number: account_number,
      id_sender_bank: null,
      recipient_account_number: ``,
      id_recipient_bank: null,
      transaction_amount: null,
      transaction_message: `${fullname.toUpperCase()} chuyen tien`,
      fee_payment_method: SENDER,
      recipient_name: '',
    },
    validationSchema: Yup.object({
      transaction_amount: Yup.number()
        .required('Số tiền giao dịch là bắt buộc')
        .min(5000, 'Số tiền giao dịch tối thiểu là 5,000 VNĐ')
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
  
  const handleClickContactBook = () => {
    if (contacts === null) {
        dispatch(getCustomerContacts());
    }
    setDisplayContacts(true);
  }

  const handleAccountNumberBlur = async (e) => {
    try {
      formik.handleBlur(e);
      const account_number = e.target.value;
      if (account_number) {
        dispatch(setUserStatus({
          status: LOADING
        }));
        const recipient_name = await CustomerService.getExternalRecipientInfo(Number(formik.id_recipient_bank), account_number);
        formik.setFieldValue('recipient_name', recipient_name);
        dispatch(setUserStatus({
          status: SUCCEEDED
        }));
      }
    } catch (error){
      console.log(error.message)
      dispatch(setUserStatus({
        status: FAILED,
        error: error.message
      }));
    }
  };

  useEffect(()=>{
    console.log(selectedContact)
    if (selectedContact){
      formik.setFieldValue("recipient_account_number", selectedContact.account_number)
      formik.setFieldValue("recipient_name", selectedContact.contact_fullname)
    }
  },[selectedContact])

  return (
    <>
      {
        displayContacts && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
            <ContactList 
              isMutable={false} 
              isInternal={false}
              setSelectedContact={setSelectedContact} 
              setDisplayContacts={setDisplayContacts}
            />
          </div>
        )
      }
      <TransferAccount formik={formik} />

      <div className="w-8/12 mx-auto p-6 flex flex-col bg-white rounded-xl ">

        <ExternalBankSelect formik={formik} />
       
        <div className="w-full flex justify-between items-center mt-4">
          <div className="w-3/12 font-semibold">
            Tài khoản thụ hưởng
          </div>
          <div className="w-7/12">
            <div className="flex items-center rounded-xl outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-red-800">
              <input
                type="text"
                name="recipient_account_number"
                required
                placeholder='Nhập số tài khoản'
                value={formik.values.recipient_account_number}
                onChange={formik.handleChange}
                onBlur={handleAccountNumberBlur}
                className="w-full flex-1 bg-white p-3 text-base rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 text-md"
              />
              <FaAddressBook className="text-xl text-red-800 cursor-pointer hover:text-red-700 me-2" onClick={handleClickContactBook}/>
            </div>
          
            
          </div>
        </div>

        {formik.touched.recipient_account_number && formik.errors.recipient_account_number && (
          <div className="w-7/12 ms-auto text-red-500 text-sm mt-1">{formik.errors.recipient_account_number}</div>
        )}

        {
          formik.values.recipient_name && (
            <div className="w-full mt-4 flex justify-between items-center">
              <div className="w-3/12 font-semibold">Tên người thụ hưởng</div>
              <div className="w-7/12 ">
                {formik.values.recipient_name}
              </div>
            </div>
          )
        }
        
        <div className="w-full mt-4 flex justify-between items-center">
          <div className="w-3/12 font-semibold">Số tiền</div>
          <div className="w-7/12 ">
            <div className="flex items-center rounded-xl outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-red-800">
              <input
                  type="number"
                  id="transaction_amount"
                  name="transaction_amount"
                  required
                  placeholder="Nhập số tiền"
                  value={formik.values.transaction_amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full flex-1 bg-white p-3 text-base rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 text-md"
                />
               <label for="transaction_amount" class="focus-within:relative pr-3 text-md text-gray-400">VNĐ</label>
            </div>
          </div>
        </div>

        {formik.touched.transaction_amount && formik.errors.transaction_amount && (
          <div className="w-7/12 ms-auto text-red-500 text-sm mt-1">{formik.errors.transaction_amount}</div>
        )}

        <div className="w-full mt-4 flex justify-between items-center">
          <div className="w-3/12 font-semibold">Nội dung chuyển tiền</div>
          <div className="w-7/12 rounded-xl outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-red-800">
            <input
              type="text"
              name="transaction_message"
              placeholder='Nhập nội dung chuyển tiền'
              value={formik.values.transaction_message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full flex-1 bg-white p-3  rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 text-md"
            />
          </div>
        </div>

        <div className="w-full mt-4 flex justify-between items-center">
          <div className="w-3/12 font-semibold">Phí giao dịch</div>
          <div className="w-7/12 ">
           {Number(1000).toLocaleString()} VNĐ
          </div>
        </div>

        <div className="w-full mt-4 flex justify-between items-center">
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
          className="w-fit self-center px-4 py-2 mt-8 bg-red-800 text-white rounded-xl hover:bg-red-700"
        >
          Tiếp tục
        </button>
      </div>
    </>
  );
}
