import React from 'react';
import { BanknotesIcon } from '@heroicons/react/24/solid';

const CustomerTable = ({ customers, openDialog, setSelectedCustomerId }) => {
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
                  // onClick={}
                  className="h-fit p-2 text-red-800 border-[1px] border-red-800 rounded-full hover:bg-red-100 transition">
                  <div className="flex size-4 flex-none items-center justify-center rounded-3xl" 
                    onClick={() => {
                      setSelectedCustomerId(customer.id)
                      openDialog(); 
                    }}>
                    <BanknotesIcon className="size-5 text-red-800 " />
                  </div>
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
