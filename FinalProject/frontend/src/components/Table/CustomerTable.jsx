import React from "react";
import { FaEye } from 'react-icons/fa';

const CustomerTable = ({ customers }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
              ID
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
              Username
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
              Họ tên
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
              Email
            </th>
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">
              Số điện thoại
            </th>
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">
              Tài khoản thanh toán
            </th>
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {customers.map((customer, index) => (
            <tr
              key={customer.id}
              className={index % 2 === 0 ? "bg-white" : "bg-red-50"}
            >
              <td className="py-3 px-4 text-center text-sm text-gray-700">{customer.id}</td>
              <td className="py-3 px-4 text-sm text-gray-700">
                {customer.username}
              </td>
              <td className="py-3 px-4 text-sm text-gray-700">{customer.fullname}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{customer.email}</td>
              <td className="py-3 px-4 text-center text-sm text-gray-700">{customer.phone}</td>
              <td className="py-3 px-4 text-center text-sm text-gray-700">
                {customer.accounts[0]?.account_number || 'Chưa có'}
              </td>
              <td className="py-3 px-4 text-sm text-gray-700">
                <div className="flex justify-center items-center">
                  <button
                    className="text-red-500 hover:text-red-700"
                    title="View"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
