import React, { useState } from 'react';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import EditEmployeeModal from '../EmployeeMgmt/EditEmployeeModal';
import { useDispatch } from 'react-redux';
import { deleteEmployee } from '../../redux/userThunk';
import ViewEmployeeModal from '../EmployeeMgmt/ViewEmployeeModal';

const EmployeeTable = ({ employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null); 
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); 
  const dispatch = useDispatch();

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="overflow-x-auto shadow-md">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-red-100">
          <tr>
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">ID</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Username</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Họ tên</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
            {/* <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Số điện thoại</th> */}
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700"></th>
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {employees.map((employee, index) => (
            <tr
              key={employee.id}
              className={index % 2 === 0 ? "bg-white" : "bg-white"}
            >
              <td className="py-3 px-4 text-center text-sm text-gray-700">{employee.id}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{employee.username}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{employee.fullname}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{employee.email}</td>
              {/* <td className="py-3 px-4 text-center text-sm text-gray-700">{employee.phone}</td> */}
              <td className="py-1 px-2 text-center text-xs text-gray-700">
                <span className={`px-2 py-1 rounded-lg ${employee.status === 'ACTIVE' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                  {employee.status}
                </span>
              </td>
              <td className="py-2 px-2 text-sm text-gray-700 flex justify-center space-x-2">
                <button className="h-fit p-2 text-blue-800 border-[1px] border-blue-800 rounded-full hover:bg-blue-100 transition"
                  onClick={() => handleView(employee)}>
                  <div className="flex size-4 flex-none items-center justify-center rounded-3xl">
                    <HiEye className="size-5 text-blue-800" />
                  </div>
                </button>
                <button className="h-fit p-2 text-green-800 border-[1px] border-green-800 rounded-full hover:bg-green-100 transition" 
                  onClick={() => handleEdit(employee)}>
                  <div className="flex size-4 flex-none items-center justify-center rounded-3xl">
                    <HiPencil className="size-5 text-green-800" />
                  </div>
                </button>
                <button className={`h-fit p-2 text-red-800 border-[1px] border-red-800 rounded-full hover:bg-red-100 transition ${employee.status === 'DELETED' ? 'cursor-not-allowed' : ''}`}
                  onClick={() => handleDelete(employee)}
                  disabled={employee.status === 'DELETED'}>
                  <div className="flex size-4 flex-none items-center justify-center rounded-3xl">
                    <HiTrash className="size-5 text-red-800" />
                  </div>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditEmployeeModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        employee={selectedEmployee}
      />

      <ViewEmployeeModal 
        isOpen={isViewModalOpen} 
        closeModal={handleCloseModal} 
        employee={selectedEmployee} 
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa nhân viên {employeeToDelete.fullname} không?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-white text-red-800 border-2 border-red-800 rounded-xl hover:bg-red-100"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  dispatch(deleteEmployee(employeeToDelete.id));
                  setIsDeleteModalOpen(false);
                }}
                className="px-4 py-2 bg-red-800 text-white rounded-xl hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
