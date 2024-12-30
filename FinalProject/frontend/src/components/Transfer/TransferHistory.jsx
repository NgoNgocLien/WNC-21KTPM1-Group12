import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { FaMoneyBillAlt, FaExchangeAlt, FaRegCreditCard } from 'react-icons/fa';
import { ArrowsRightLeftIcon, BanknotesIcon, CreditCardIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { fetchAccountTransactions, fetchBankName } from '../../redux/transactionThunk';
import { IDLE, LOADING, FAILED, SUCCEEDED } from '../../util/config';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

export default function TransferHistory() {
  const dispatch = useDispatch();
  const { transactions, banks, status } = useSelector((state) => state.transaction);
  const { account_number } = useSelector((state) => state.user)

  const today = new Date();
  const thirtyOneDaysAgo = new Date();
  thirtyOneDaysAgo.setDate(today.getDate() - 30);

  const [filter, setFilter] = useState('all');
  const [startDate, setStartDate] = useState(thirtyOneDaysAgo);
  const [endDate, setEndDate] = useState(today);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const typeMatch = filter === 'all' || (filter === 'sender' && (t.type === 'Sender')) ||
        (filter === 'debt' && (t.type === 'Sender (Debt)' || t.type === 'Recipient (Debt)')) ||
        (filter === 'recipient' && (t.type === 'Recipient' || t.type === 'Deposit'));

      const startDateMatch = !startDate || new Date(t.transaction_time) >= new Date(startDate);
      const endDateMatch = !endDate || new Date(t.transaction_time) <= new Date(endDate);

      return typeMatch && startDateMatch && endDateMatch;
    });
  }, [transactions, filter, startDate, endDate]);

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
      if (filteredTransactions.length === 0) {
        return <p className="text-center text-gray-500">Không có giao dịch nào trong khoảng thời gian này</p>;
      }

      return (
        <div className="max-h-96 overflow-y-auto space-y-4">
          {filteredTransactions.map((transaction) => {
            const uniqueKey = `${transaction.type}-${transaction.id}`;
            const formattedTime = format(new Date(transaction.transaction_time), 'dd/MM/yyyy - HH:mm:ss');
            const amountSign = transaction.type === 'Sender' || transaction.type === 'Sender (Debt)' ? '-' : '+';
            let bankId;
            if (transaction.type === 'Deposit') {
              bankId = 1;
            } else if (transaction.type === 'Recipient' || transaction.type === 'Recipient (Debt)') {
              bankId = transaction.id_sender_bank;
            } else if (transaction.type === 'Sender' || transaction.type === 'Sender (Debt)') {
              bankId = transaction.id_recipient_bank;
            }

            const bankName = banks[bankId]?.name;
            const bankLogo = banks[bankId]?.logo;

            let transactionLabel = '';
            let labelColor = '';

            if (transaction.type === 'Recipient' || transaction.type === 'Deposit') {
              transactionLabel = 'Nhận tiền';
              labelColor = 'bg-green-500';
            } else if (transaction.type === 'Sender') {
              transactionLabel = 'Chuyển tiền';
              labelColor = 'bg-yellow-500';
            } else if (transaction.type === 'Recipient (Debt)' || transaction.type === 'Sender (Debt)') {
              transactionLabel = 'Thanh toán nợ';
              labelColor = 'bg-blue-500';
            }

            const formattedAmount = new Intl.NumberFormat().format(transaction.transaction_amount);
            const formattedBalance = new Intl.NumberFormat().format(transaction.current_balance);

            return (
              <div
                key={uniqueKey}
                className="p-4 border-b border-gray-300 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={bankLogo ? bankLogo : `https://logo.clearbit.com/${bankName}.com`}
                    alt="Bank Logo"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{transaction.transaction_message || transaction.deposit_message || "(Không có nội dung)"}</p>
                    {/* <p className="text-sm text-gray-600">{bankName}</p> */}
                    <span className="text-sm text-gray-700 mr-5">{formattedTime}</span>
                    <span className="text-sm">Số dư: {formattedBalance} VNĐ</span>
                  </div>
                </div>
                <div className='amount w-60 text-right'>
                  <p className={`text-lg ${amountSign === '+' ? 'text-green-600' : 'text-red-600'}`}>
                    {amountSign}{formattedAmount} VNĐ
                  </p>
                </div>

                <div className={`ml-4 py-1 px-2 text-xs font-base rounded text-white ${labelColor}`}>
                  {transactionLabel}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const handleStartDateChange = (date) => setStartDate(date);
  const handleEndDateChange = (date) => setEndDate(date);

  return (
    <>
      <div className="p-6 bg-white rounded-xl space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-base font-medium text-gray-500 mb-2">Tài khoản</label>
            <select
              value={account_number}
              className="w-full p-3 border border-gray-300 rounded-xl"
            >
              <option value="">{account_number}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium text-gray-500 mb-2">Từ ngày</label>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                dateFormat="dd/MM/yyyy"
                className="w-full p-3 border border-gray-300 rounded-xl"
                wrapperClassName="react-datepicker-wrapper w-full"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-500 mb-2">Đến ngày</label>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                dateFormat="dd/MM/yyyy"
                className="w-full p-3 border border-gray-300 rounded-xl"
                wrapperClassName="react-datepicker-wrapper w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            className={`flex items-center gap-2 py-2 px-4 rounded-xl ${filter === 'recipient' ? 'bg-green-500 hover:bg-green-400' : 'bg-gray-200'
              } text-white`}
            onClick={() => setFilter('recipient')}
          >
            <BanknotesIcon className="w-6 h-6" />
            Nhận tiền
          </button>
          <button
            className={`flex items-center gap-2 py-2 px-4 rounded-xl ${filter === 'sender' ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-gray-200'
              } text-white`}
            onClick={() => setFilter('sender')}
          >
            <ArrowsRightLeftIcon className="w-6 h-6" />
            Chuyển tiền
          </button>
          <button
            className={`flex items-center gap-2 py-2 px-4 rounded-xl ${filter === 'debt' ? 'bg-blue-500 hover:bg-blue-400' : 'bg-gray-200'
              } text-white`}
            onClick={() => setFilter('debt')}
          >
            <CreditCardIcon className="w-6 h-6" />
            Thanh toán nợ
          </button>
          <button
            className={`flex items-center gap-2 py-2 px-4 rounded-xl ${
              filter === 'all' ? 'bg-red-800 hover:bg-red-700' : 'bg-gray-200'
            } text-white`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
        </div>
        <p className="text-sm text-right">
          <span className="text-red-600">Quý khách lưu ý:</span> Thời gian tìm kiếm giới hạn trong 31 ngày
        </p>
      </div>

      <div className="mt-1 p-6 bg-white rounded-xl">{renderTransactions()}</div>
    </>
  );
}
