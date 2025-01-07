import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const TransactionTable = ({ transactions, banks }) => {
  const [sortedTransactions, setSortedTransactions] = useState(transactions);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    setSortedTransactions(transactions); 
  }, [transactions]);

  const sortByDate = () => {
    const sorted = [...sortedTransactions].sort((a, b) => {
      const dateA = new Date(a.transaction_time);
      const dateB = new Date(b.transaction_time);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setSortedTransactions(sorted);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  console.log(transactions);
  console.log(sortedTransactions)
  return (
    <div className="max-h-screen overflow-y-auto shadow-md">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-red-100 sticky top-0 z-10">
          <tr>
            <th className="py-3 pl-2 text-left text-sm font-semibold text-gray-700">Mã giao dịch</th>
            <th
              onClick={sortByDate}
              className="py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer">
              Ngày giao dịch {sortDirection === 'asc' ? '▲' : '▼'}
            </th>
            <th className="py-3 pl-2 text-left text-sm font-semibold text-gray-700">Tài khoản nội bộ</th>
            <th className="py-3 pl-2 text-left text-sm font-semibold text-gray-700">Ngân hàng liên kết</th>
            <th className="py-3 pl-2 text-left text-sm font-semibold text-gray-700">Số tiền</th>
            <th className="py-3 pl-1 text-left text-sm font-semibold text-gray-700"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedTransactions.length > 0 ? sortedTransactions.map((transaction, index) => (
            <tr key={index}>
              <td className="py-3 pl-2 text-left text-sm text-gray-700 truncate max-w-72">{transaction.id}</td>
              <td className="py-3 text-left text-sm text-gray-700">
                {transaction.transaction_time ? format(new Date(transaction.transaction_time), 'dd/MM/yyyy HH:mm:ss') : 'N/A'}
              </td>
              <td className="py-3 pl-2 text-left text-sm text-gray-700">
                {transaction.id_sender_bank === 1 ? transaction.sender_account_number : transaction.recipient_account_number}
              </td>
              <td className="py-3 px-2 text-left text-sm text-gray-700">
                {banks[transaction.id_sender_bank === 1 ? transaction.id_recipient_bank : transaction.id_sender_bank]?.name}
              </td>
              <td className="py-3 px-2 text-left text-sm text-gray-700">
                {new Intl.NumberFormat().format(transaction.transaction_amount)} VNĐ
              </td>
              <td className="py-3 px-2 text-left text-sm text-gray-700">
                <span className={`px-2 py-1 rounded-lg ${transaction.id_sender_bank === 1 ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
                  {transaction.id_sender_bank === 1 ? 'Chuyển tiền' : 'Nhận tiền'}
                </span>
              </td>
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
