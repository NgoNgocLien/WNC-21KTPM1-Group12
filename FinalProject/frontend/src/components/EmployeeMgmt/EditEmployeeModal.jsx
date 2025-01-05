import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { updateEmployee } from '../../redux/userThunk';

const EditEmployeeModal = ({ isOpen, closeModal, employee }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (employee) {
      formik.setValues({
        username: employee.username,
        password: '******',
        fullname: employee.fullname,
        email: employee.email,
        phone: employee.phone,
        status: employee.status,
      });
    }
  }, [employee]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      fullname: '',
      email: '',
      phone: '',
      status: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Tên đăng nhập là bắt buộc'),
      password: Yup.string().required('Mật khẩu là bắt buộc'),
      fullname: Yup.string().required('Họ tên là bắt buộc'),
      email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
      phone: Yup.string()
        .matches(/^[0-9]+$/, 'Số điện thoại chỉ chứa các chữ số')
        .required('Số điện thoại là bắt buộc'),
      status: Yup.string().oneOf(['ACTIVE', 'DELETED']).required('Trạng thái là bắt buộc'),
    }),
    onSubmit: (values, { resetForm }) => {
      const updatedValues = {
        ...values,
        password: values.password === '******' ? undefined : values.password,
      };
      dispatch(updateEmployee({ id: employee.id, data: updatedValues }));
      closeModal();
      resetForm();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
      <div className="bg-white p-6 rounded-xl w-96 flex flex-col items-center">
        <h3 className="text-xl font-semibold">Chỉnh Sửa Nhân Viên</h3>

        <form onSubmit={formik.handleSubmit} className="w-full my-2 space-y-4">
          {['username', 'password', 'fullname', 'email', 'phone'].map((field, idx) => (
            <div key={idx}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                {field === 'username' ? 'Tên đăng nhập' : field === 'password' ? 'Mật khẩu' : field === 'fullname' ? 'Họ tên' : field === 'email' ? 'Email' : 'Số điện thoại'}
                <span className="text-red-500"> *</span>
              </label>
              <input
                id={field}
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[field]}
              />
              {formik.touched[field] && formik.errors[field] && (
                <div className="text-red-500 text-sm mt-1">{formik.errors[field]}</div>
              )}
            </div>
          ))}

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Trạng thái<span className="text-red-500"> *</span>
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.status}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="DELETED">DELETED</option>
            </select>
            {formik.touched.status && formik.errors.status && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.status}</div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => {
                closeModal();
                formik.resetForm();
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-500 focus:outline-none"
            >
              Cập nhật nhân viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
