import React from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

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
              <td className="py-3 px-4 text-center text-sm text-gray-700">
                {employee.status}
              </td>
              <td className="py-2 px-3 text-sm text-gray-700">
                <button
                  className="text-red-500 hover:text-red-700 focus:outline-none transition duration-200 ease-in-out"
                  title="View"
                >
                  <FaEye className="w-5 h-5" />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 focus:outline-none transition duration-200 ease-in-out"
                  title="Edit"
                >
                  <FaEdit className="w-5 h-5" />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 focus:outline-none transition duration-200 ease-in-out"
                  title="Delete"
                >
                  <FaTrash className="w-5 h-5" />
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
