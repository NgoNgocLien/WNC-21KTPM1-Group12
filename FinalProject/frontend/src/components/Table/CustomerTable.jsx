import React from 'react';
import { FaEdit } from 'react-icons/fa';

const CustomerTable = ({ customers }) => {
  return (
    <div className="overflow-x-auto shadow-md">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-red-100">
          <tr>
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">ID</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Username</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Họ tên</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Số điện thoại</th>
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Tài khoản thanh toán</th>
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {customers.map((customer, index) => (
            <tr
              key={customer.id}
              className={index % 2 === 0 ? "bg-white" : "bg-white"}
            >
              <td className="py-3 px-4 text-center text-sm text-gray-700">{customer.id}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{customer.username}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{customer.fullname}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{customer.email}</td>
              <td className="py-3 px-4 text-center text-sm text-gray-700">{customer.phone}</td>
              <td className="py-3 px-4 text-center text-sm text-gray-700">
                {customer.accounts[0]?.account_number || 'Chưa có'}
              </td>
              <td className="py-2 px-3 text-sm text-gray-700">
                <button
                  className="text-red-500 hover:text-red-700 focus:outline-none transition duration-200 ease-in-out"
                  title="Edit"
                >
                  <FaEdit className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
