import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { createEmployee } from '../../redux/userThunk';

const AddEmployeeModal = ({ isOpen, closeModal }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      fullname: '',
      email: '',
      phone: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Tên đăng nhập là bắt buộc'),
      password: Yup.string().required('Mật khẩu là bắt buộc'),
      fullname: Yup.string().required('Họ tên là bắt buộc'),
      email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
      phone: Yup.string()
        .matches(/^[0-9]+$/, 'Số điện thoại chỉ chứa các chữ số')
        .required('Số điện thoại là bắt buộc'),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(createEmployee(values));
      closeModal();
      resetForm();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
      <div className="bg-white p-6 rounded-xl w-96 flex flex-col items-center">
        <h3 className="text-xl font-semibold">Thêm Mới Nhân Viên</h3>

        <form onSubmit={formik.handleSubmit} className="w-full my-4">
          {/* Login Information */}
          <div className="my-2">
            <label htmlFor="username" className="block text-sm font-semibold">Tên đăng nhập
              <span className="text-red-500"> *</span>
            </label>
            <input
              id="username"
              type="text"
              name="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-500 text-sm">{formik.errors.username}</div>
            )}
          </div>

          <div className="my-2">
            <label htmlFor="password" className="block text-sm font-semibold">Mật khẩu
              <span className="text-red-500"> *</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            )}
          </div>

          {/* Personal Information */}
          <div className="my-2">
            <label htmlFor="fullname" className="block text-sm font-semibold">Họ tên
              <span className="text-red-500"> *</span>
            </label>
            <input
              id="fullname"
              type="text"
              name="fullname"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fullname}
            />
            {formik.touched.fullname && formik.errors.fullname && (
              <div className="text-red-500 text-sm">{formik.errors.fullname}</div>
            )}
          </div>

          <div className="my-2">
            <label htmlFor="email" className="block text-sm font-semibold">Email
              <span className="text-red-500"> *</span>
            </label>
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
            <label htmlFor="phone" className="block text-sm font-semibold">Số điện thoại
              <span className="text-red-500"> *</span>
            </label>
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
              Thêm nhân viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
