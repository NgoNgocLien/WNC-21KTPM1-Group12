import React, { useState } from 'react';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import EditEmployeeModal from '../EmployeeMgmt/EditEmployeeModal';

const EmployeeTable = ({ employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
              <td className="py-1 px-2 text-center text-sm text-gray-700">
                <span className={`px-3 py-1 rounded-lg ${employee.status === 'ACTIVE' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                  {employee.status}
                </span>
              </td>
              <td className="py-2 px-2 text-sm text-gray-700 flex justify-center space-x-2">
                <button className="h-fit p-2 text-blue-800 border-[1px] border-blue-800 rounded-full hover:bg-blue-100 transition">
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
                <button className="h-fit p-2 text-red-800 border-[1px] border-red-800 rounded-full hover:bg-red-100 transition">
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

    </div>
  );
};

export default EmployeeTable;
