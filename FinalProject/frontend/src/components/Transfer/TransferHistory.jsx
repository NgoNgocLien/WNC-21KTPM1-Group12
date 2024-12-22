import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { FaMoneyBillAlt, FaExchangeAlt, FaRegCreditCard } from 'react-icons/fa';
import { ArrowsRightLeftIcon, BanknotesIcon, CreditCardIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { fetchAccountTransactions, fetchBankName } from '../../redux/transactionThunk';
import { IDLE, LOADING, FAILED, SUCCEEDED } from '../../util/config';
import { format } from 'date-fns';

export default function TransferHistory() {
  const dispatch = useDispatch();
  const { transactions, banks, status } = useSelector((state) => state.transaction);
  const { account_number } = useSelector((state) => state.user)
  //const [account, setAccount] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(t.type);
      const startDateMatch = !startDate || new Date(t.transaction_time) >= new Date(startDate);
      const endDateMatch = !endDate || new Date(t.transaction_time) <= new Date(endDate);
      return typeMatch && startDateMatch && endDateMatch;
    });
  }, [transactions, selectedTypes, startDate, endDate]);

  useEffect(() => {
    if (status === IDLE) {
      dispatch(fetchAccountTransactions());
    }
  }, [dispatch, status]);

  useEffect(() => {
    filteredTransactions.forEach((transaction) => {
      const bankId =
        transaction.type === 'Sender' || transaction.type === 'Sender (Debt)'
          ? transaction.id_recipient_bank
          : transaction.id_sender_bank;

      if (bankId && !banks[bankId]) {
        dispatch(fetchBankName(bankId));
      }
    });
  }, [filteredTransactions, banks, dispatch]);

  const renderTransactions = () => {
    if (status === SUCCEEDED) {
      return (
        <div className="max-h-96 overflow-y-auto space-y-4">
          {filteredTransactions.map((transaction) => {
            const uniqueKey = `${transaction.type}-${transaction.id}`;
            const formattedTime = format(new Date(transaction.transaction_time), 'dd/MM/yyyy - HH:mm');
            const amountSign = transaction.type === 'Sender' || transaction.type === 'Sender (Debt)' ? '-' : '+';
            const bankName = transaction.type === 'Sender' || transaction.type === 'Sender (Debt)' ? banks[transaction.id_recipient_bank]?.name : banks[transaction.id_sender_bank]?.name;
            const bankId =
              transaction.type === 'Sender' || transaction.type === 'Sender (Debt)'
                ? transaction.id_recipient_bank
                : transaction.id_sender_bank;
            return (
              <div
                key={uniqueKey}
                className="p-4 border-b border-gray-300 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={`https://logo.clearbit.com/${bankName}.com` || banks[bankId].logo}
                    alt="Bank Logo"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{transaction.transaction_message || transaction.deposit_message}</p>
                    <p className="text-sm text-gray-600">{bankName}</p>
                  </div>
                </div>
                <div>
                  {/* <p className="font-semibold text-gray-600">Mã giao dịch: {transaction.code}</p> */}
                  <p className="text-sm">Số dư: {transaction.current_balance}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{formattedTime}</p>
                  <p
                    className={`text-xl ${amountSign === '+' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {amountSign}{transaction.transaction_amount}
                  </p>
                </div>
                <div className="ml-4 py-1 px-3 bg-gray-100 text-sm font-medium rounded">
                  {transaction.type}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="p-6 bg-white rounded-lg space-y-4">
        <p className="text-lg font-semibold">Lịch sử giao dịch</p>
        <p className="text-sm text-red-600">
          Quý khách lưu ý: Thời gian tìm kiếm giới hạn trong 31 ngày.
        </p>
        <hr className="my-4" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tài khoản</label>
            <select
              value={account_number}
              // onChange={(e) => setAccount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">{account_number}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Loại giao dịch</label>
            <select
              multiple
              value={selectedTypes}
              onChange={(e) =>
                setSelectedTypes(Array.from(e.target.selectedOptions, (option) => option.value))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Tất cả giao dịch</option>
              <option value="Sender">Chuyển tiền</option>
              <option value="Recipient">Nhận tiền</option>
              <option value="Sender (Debt)">Thanh toán nợ</option>
              <option value="Recipient (Debt)">Nhận thanh toán nợ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Từ ngày</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Đến ngày</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="inline-flex items-center gap-1 py-2 px-3 bg-red-800 text-white font-semibold rounded-lg focus:outline-none"
          >
            <MagnifyingGlassIcon className="w-5 h-5" /> Tra cứu
          </button>
        </div>
      </div>

      <div className="mt-6 p-6 bg-white rounded-lg">{renderTransactions()}</div>
    </>
  );
}
