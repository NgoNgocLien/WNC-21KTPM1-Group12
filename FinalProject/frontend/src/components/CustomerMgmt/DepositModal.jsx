import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosClose } from 'react-icons/io';

import EmployeeService from './../../services/EmployeeService'
import { setUserStatus } from '../../redux/userSlice';
import { FAILED, LOADING, SUCCEEDED } from '../../util/config';
import notify from '../../util/notification';

const DepositModal = ({ isOpen, closeModal, id_customer }) => {
  const {id} = useSelector((state) => state.user)
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      deposit_amount: null,
      deposit_message: 'Nạp tiền vào tài khoản',
    },
    validationSchema: Yup.object({
      deposit_amount: Yup.number()
        .required('Số tiền là bắt buộc')
        .min(5000, 'Số tiền tối thiểu là 5000')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(setUserStatus({
          status: LOADING
        }));
  
        const response = await EmployeeService.makeDeposit({
          id_customer: id_customer,
          id_employee: id,
          ...values
        })

        dispatch(setUserStatus({
          status: SUCCEEDED
        }));

        notify(response.message)

      } catch (error){
        console.log(error.message)
        dispatch(setUserStatus({
          status: FAILED,
          error: error.message
        }));
      }
      
      closeModal();
      resetForm();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
      <div className="bg-white p-6 rounded-xl w-96 flex flex-col items-center">
        <div className="flex w-full justify-between items-center">
          <h3 className="text-xl font-semibold">Nạp tiền</h3>
          <IoIosClose className="text-gray-500 text-3xl cursor-pointer hover:text-gray-700" 
            onClick={() => {
              closeModal();
              formik.resetForm();
            }} 
          />
        </div>
        

        <form onSubmit={formik.handleSubmit} className="w-full mt-4">
        <div className="my-2">
          <div className="mb-2">Số tiền 
            <span className="text-red-500"> *</span>
          </div>
          <div className="flex items-center rounded-xl outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-red-800">
            <input
              type="text"
              id="deposit_amount"
              name="deposit_amount"
              required
              placeholder="Nhập số tiền"
              value={
                formik.values.deposit_amount
                  ? Number(formik.values.deposit_amount).toLocaleString('en-US') // Format with commas
                  : ''
              }
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, '');
                if (!isNaN(rawValue) && rawValue !== '') {
                  formik.setFieldValue('deposit_amount', rawValue);
                } else if (rawValue === '') {
                  formik.setFieldValue('deposit_amount', ''); 
                }
              }}
              onBlur={formik.handleBlur}
              className="w-full flex-1 bg-white p-3 text-base rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 text-md"
            />
            <label for="deposit_amount" class="focus-within:relative pr-3 text-md text-gray-400">VNĐ</label>
          </div>
          {formik.touched.deposit_amount && formik.errors.deposit_amount && (
            <div className="text-red-500 text-sm">{formik.errors.deposit_amount}</div>
          )}
        </div>

        <div className="my-2">
          <div className="mb-2">Nội dung chuyển tiền
          </div>
          <div className="">
            <div className="flex items-center rounded-xl outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-red-800">
              <input
                type="text"
                id="deposit_message"
                name="deposit_message"
                required
                value={formik.values.deposit_message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full flex-1 bg-white p-3 text-base rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 text-md"
              />
            </div>
            
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            type="button"
            onClick={() => {
              closeModal();
              formik.resetForm();
            }}
            className="px-4 py-2 bg-white text-red-800 border-2 border-red-800 rounded-xl hover:bg-red-100"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-800 text-white rounded-xl hover:bg-red-700"
          >
            Nạp tiền
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default DepositModal;
