import React from 'react';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';

const EmployeeTable = ({ employees }) => {
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
                <span className={`px-3 py-1 rounded-lg ${employee.status === 'ACTIVE' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {employee.status}
                </span>
              </td>
              <td className="py-2 px-2 text-sm text-gray-700 flex justify-center space-x-2.5">
                <button
                  className="text-black-500 hover:text-black focus:outline-none transition duration-200 ease-in-out"
                  title="View"
                >
                  <HiEye className="w-5 h-5" />
                </button>
                <button
                  className="text-green-500 hover:text-green-700 focus:outline-none transition duration-200 ease-in-out"
                  title="Edit"
                >
                  <HiPencil className="w-5 h-5" />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 focus:outline-none transition duration-200 ease-in-out"
                  title="Delete"
                >
                  <HiTrash className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
