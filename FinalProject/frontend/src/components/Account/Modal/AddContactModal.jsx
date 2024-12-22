import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';

import { createOneContact } from './../../../redux/userThunk';
import getFullname from '../../../util/getFullname'
import banks from './banks'
import { getAccessToken } from '../../../util/cookie';

const bankOptions = banks.map(bank => ({
  value: bank.bank_id,
  label: (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={bank.brand_logo}
        alt="Bank Logo"
        style={{ width: 20, height: 20, borderRadius: '50%', marginRight: 10 }}
      />
      {bank.bank_name}
    </div>
  ),
}));

const AddContactModal = ({ isOpen, closeModal, recipient }) => {
  const dispatch = useDispatch();
  const access_token = getAccessToken();

  const formik = useFormik({
    initialValues: {
      bank_id: recipient?.bank_id || 1, 
      account_number: recipient?.account_number || '',
      contact_fullname: recipient?.fullname || '',
      nickname: recipient?.fullname || '',
    },
    validationSchema: Yup.object({
      account_number: Yup.string()
        .required('Tài khoản thanh toán là bắt buộc'),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values)
      dispatch(createOneContact(values))
      closeModal();
      resetForm();
    },
  });

  const handleAccountNumberBlur = async (e) => {
    formik.handleBlur(e);
    const account_number = e.target.value;
    if (account_number) {
      const bank_id = formik.getFieldProps('bank_id').value
      const contact_fullname = await getFullname(access_token, account_number, bank_id);
      formik.setFieldValue('contact_fullname', contact_fullname);
      formik.setFieldValue('nickname', contact_fullname);
    }
  };

  const handleChangeBankId = async (option) => {
    const bank_id = option.value
    formik.setFieldValue('bank_id',bank_id)
    if (bank_id) {
      const account_number = formik.getFieldProps('account_number').value;
      // console.log({account_number, bank_id});
      if (account_number) {
        const contact_fullname = await getFullname(access_token, account_number, bank_id);
        formik.setFieldValue('contact_fullname', contact_fullname);
        formik.setFieldValue('nickname', contact_fullname);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96 flex flex-col items-center">
        <h3 className="text-xl font-semibold">Thêm Mới Người Nhận</h3>

        <form onSubmit={formik.handleSubmit} className="w-full my-4">
          <div className="mb-4">
            <p className="text-gray-500 mb-2">Ngân hàng<span className="text-red-500">*</span></p>
            <Select
              name="bank_id"
              value={bankOptions.find(option => option.value === formik.values.bank_id)}
              onChange={(option) => handleChangeBankId(option)}
              options={bankOptions}
              styles={customStyles}
              isSearchable={false || recipient}
            />
          </div>

          <div className="flex mb-4 space-x-4">
            <div className="w-1/2">
              <p className="text-gray-500 mb-2">Tài khoản thanh toán<span className="text-red-500">*</span></p>
              <input
                type="text"
                name="account_number"
                value={formik.values.account_number}
                onChange={formik.handleChange}
                onBlur={handleAccountNumberBlur}
                disabled={true && recipient}
                className="w-full border-2 p-2 rounded-lg"
              />
              {formik.touched.account_number && formik.errors.account_number ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.account_number}</div>
              ) : null}
            </div>
            <div className="w-1/2">
              <p className="text-gray-500 mb-2">Tên đăng ký</p>
              <input
                type="text"
                name="contact_fullname"
                value={formik.values.contact_fullname}
                onChange={formik.handleChange}
                className="w-full border-2 p-2 rounded-lg"
                readOnly
                disabled
              />
            </div>
          </div>

          <p className="text-gray-500">Tên gợi nhớ</p>
          <p className="text-sm text-gray-500 mb-2 italic">Mặc định là tên đăng ký</p>
          <input
            type="text"
            name="nickname"
            value={formik.values.nickname}
            onChange={formik.handleChange}
            className="w-full border-2 p-2 mb-2 rounded-lg"
          />
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="button"
              onClick={() => {
                closeModal();
                formik.resetForm();
              }}
              className="px-4 py-2 bg-white text-red-800 border-2 border-red-800 rounded-lg 
              disabled:bg-gray-200 disabled:text-gray-400 disabled:border-none"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-800 text-white rounded-lg disabled:bg-gray-200 disabled:text-gray-400"
            >
              Thêm người nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    backgroundColor: state.isFocused ? '#f5f5f5' : 'white',
    color: 'black',
  }),
  singleValue: (provided, state) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
  }),
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused && '2px solid rgb(153 27 27 / var(--tw-bg-opacity, 1))', 
    boxShadow: state.isFocused ? '0 0 0 2px rgba(255,0,0,0.2)' : 'none',
    '&:hover': {
      border: '2px solid rgb(153 27 27 / var(--tw-bg-opacity, 1))',
    },
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? 'rgb(153 27 27 / var(--tw-bg-opacity, 1))' : 'black',
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? 'rgb(153 27 27 / var(--tw-bg-opacity, 1))' : 'black',
  }),
};

export default AddContactModal;
