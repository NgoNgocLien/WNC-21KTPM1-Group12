import React from 'react';
import { IoIosClose } from 'react-icons/io';

const EmployeeDetailModal = ({ isOpen, closeModal, employee }) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-xl rounded-lg w-11/12 max-w-lg p-6 pb-8">
        <div className="flex justify-between items-center pb-4 mb-4">
          <h3 className="text-xl font-semibold text-black">Chi tiết nhân viên</h3>
          <IoIosClose
            className="text-gray-500 text-3xl cursor-pointer hover:text-gray-700"
            onClick={closeModal}
          />
        </div>

        <div className="grid grid-cols-2 gap-y-4">
          <div className="text-gray-600 font-base">Mã nhân viên</div>
          <div className="text-gray-800 font-medium">{employee.id}</div>

          <div className="text-gray-600 font-base">Tên đăng nhập</div>
          <div className="text-gray-800 font-medium">{employee.username}</div>

          <div className="text-gray-600 font-base">Họ và tên</div>
          <div className="text-gray-800 font-medium">{employee.fullname}</div>

          <div className="text-gray-600 font-base">Email</div>
          <div className="text-gray-800 font-medium">{employee.email}</div>

          <div className="text-gray-600 font-base">Số điện thoại</div>
          <div className="text-gray-800 font-medium">{employee.phone}</div>

          <div className="text-gray-600 font-base">Trạng thái</div>
          <div className="text-gray-800 font-medium">
            {employee.status === 'ACTIVE' ? 'Hoạt động' : 'Đã xóa'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;