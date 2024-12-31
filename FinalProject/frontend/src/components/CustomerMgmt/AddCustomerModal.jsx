import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
//import { createCustomer } from '../../redux/userThunk';

const AddCustomerModal = ({ isOpen, closeModal }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Họ tên là bắt buộc'),
      email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
      phone: Yup.string().required('Số điện thoại là bắt buộc'),
    }),
    onSubmit: (values, { resetForm }) => {
      //dispatch(createCustomer(values));
      closeModal();
      resetForm();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
      <div className="bg-white p-6 rounded-xl w-96 flex flex-col items-center">
        <h3 className="text-xl font-semibold">Thêm Mới Khách Hàng</h3>

        <form onSubmit={formik.handleSubmit} className="w-full my-4">
          <div className="my-2">
            <label htmlFor="name" className="block text-sm font-semibold">Họ tên</label>
            <input
              id="name"
              type="text"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            )}
          </div>

          <div className="my-2">
            <label htmlFor="email" className="block text-sm font-semibold">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>

          <div className="my-2">
            <label htmlFor="phone" className="block text-sm font-semibold">Số điện thoại</label>
            <input
              id="phone"
              type="text"
              name="phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500 text-sm">{formik.errors.phone}</div>
            )}
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
              Thêm khách hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
