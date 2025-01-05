import React from 'react';
import { format } from 'date-fns';

const TransactionTable = ({ transactions, banks }) => {
  return (
    <div className="overflow-x-auto shadow-md">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-red-100">
        <tr>
          <th className="py-3 px-2 text-left text-sm font-semibold text-gray-700">Mã giao dịch</th>
          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Ngày giao dịch</th>
          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Tài khoản gửi</th>
          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Tài khoản nhận</th>
          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Ngân hàng</th>
          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Số tiền</th>
          {/* <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nội dung</th> */}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200"y>
        {transactions.length > 0 ? transactions.map((transaction, index) => (
          <tr key={index}>
            <td className="py-3 px-2 text-left text-sm text-gray-700">{transaction.id}</td> 
            <td className="py-3 px-4 text-left text-sm text-gray-700">
              {transaction.transaction_time ? format(new Date(transaction.transaction_time), 'dd/MM/yyyy HH:mm:ss') : 'N/A'}
            </td>
            <td className="py-3 px-4 text-left text-sm text-gray-700">{transaction.sender_account_number}</td>
            <td className="py-3 px-4 text-left text-sm text-gray-700">{transaction.recipient_account_number}</td>
            <td className="py-3 px-4 text-left text-sm text-gray-700">{banks[transaction.id_sender_bank === 1 ? transaction.id_recipient_bank : transaction.id_sender_bank]?.name}</td>
            <td className="py-3 px-4 text-left text-sm text-gray-700">{new Intl.NumberFormat().format(transaction.transaction_amount)} VNĐ</td>
            {/* <td className="py-3 px-4 text-left text-sm text-gray-700">{transaction.transaction_message}</td> */}
          </tr>
        )) : (
          <tr>
            <td colSpan="7" className="border border-gray-300 p-2 text-center">Không có giao dịch nào</td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
  );
};

export default TransactionTable;
