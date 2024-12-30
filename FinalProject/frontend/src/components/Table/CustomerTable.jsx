import React from 'react';

const CustomerTable = ({ customers }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left font-medium text-gray-600">ID</th>
            <th className="py-2 px-4 text-left font-medium text-gray-600">Username</th>
            <th className="py-2 px-4 text-left font-medium text-gray-600">Họ tên</th>
            <th className="py-2 px-4 text-left font-medium text-gray-600">Email</th>
            <th className="py-2 px-4 text-left font-medium text-gray-600">Số điện thoại</th>
            <th className="py-2 px-4 text-left font-medium text-gray-600">Tài khoản thanh toán</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b border-gray-200">
              <td className="py-2 px-4">{customer.id}</td>
              <td className="py-2 px-4">{customer.username}</td>
              <td className="py-2 px-4">{customer.name}</td>
              <td className="py-2 px-4">{customer.email}</td>
              <td className="py-2 px-4">{customer.phone}</td>
              <td className="py-2 px-4">{customer.paymentAccount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;