import React from 'react';
import { useFormik } from 'formik';
import banks from './../../../stores/banks'
import Select from 'react-select';
import * as Yup from 'yup';

const bankOptions = banks.map(bank => ({
  value: bank.bank_id,
  label: (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={bank.bank_avatar}
        alt="Bank Logo"
        style={{ width: 20, height: 20, borderRadius: '50%', marginRight: 10 }}
      />
      {bank.bank_name}
    </div>
  ),
}));

const AddContactModal = ({ isOpen, closeModal }) => {
  const formik = useFormik({
    initialValues: {
      bank_id: 1, // Set default value
      account_number: '',
      fullname: '',
      nickname: '',
    },
    validationSchema: Yup.object({
      account_number: Yup.string()
        .required('Tài khoản thanh toán là bắt buộc'),
      fullname: Yup.string()
        .required('Họ và tên là bắt buộc'),
        nickname: Yup.string()
        .required('Tên gợi nhớ là bắt buộc'),
    }),
    onSubmit: (values) => {

      closeModal();
    },
  });


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96 flex flex-col items-center">
        <h3 className="text-xl font-semibold">Thêm Mới Người Nhận</h3>

        <form onSubmit={formik.handleSubmit} className="w-full my-4">
          <div className="my-4">
            <p className="text-gray-500 mb-2">Ngân hàng<span className="text-red-500">*</span></p>
            <Select
              name="bank_id"
              value={bankOptions.find(option => option.value === formik.values.bank_id)}
              onChange={(option) => formik.setFieldValue('bank_id', option.value)}
              options={bankOptions}
              styles={customStyles}
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
                className="w-full border-2 p-2 rounded-lg"
              />
              {formik.touched.account_number && formik.errors.account_number ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.account_number}</div>
              ) : null}
            </div>
            <div className="w-1/2">
              <p className="text-gray-500 mb-2">Họ và tên<span className="text-red-500">*</span></p>
              <input
                type="text"
                name="fullname"
                value={formik.values.fullname}
                onChange={formik.handleChange}
                className="w-full border-2 p-2 rounded-lg"
              />
              {formik.touched.fullname && formik.errors.fullname ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.fullname}</div>
              ) : null}
            </div>
          </div>

          <p className="text-gray-500 mb-2">Tên gợi nhớ<span className="text-red-500">*</span></p>
          <input
            type="text"
            name="nickname"
            value={formik.values.nickname}
            onChange={formik.handleChange}
            className="w-full border-2 p-2 rounded-lg"
          />
          {formik.touched.nickname && formik.errors.nickname ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.nickname}</div>
          ) : null}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-800 text-white rounded-lg"
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
