import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowsRightLeftIcon, BanknotesIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { getAccountTransactions, getBanks } from '../../redux/transactionThunk';
import { IDLE, SUCCEEDED } from '../../util/config';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import TransactionDetailModal from './TransactionDetailModal';
import { isEmptyArray } from 'formik';

export default function TransferHistory() {
  const dispatch = useDispatch();
  const { transactions, banks, status } = useSelector((state) => state.transaction);
  const { account_number } = useSelector((state) => state.user)

  const today = new Date();
  const thirtyOneDaysAgo = new Date();
  thirtyOneDaysAgo.setDate(today.getDate() - 29);

  const [filters, setFilters] = useState(['all']);
  const [startDate, setStartDate] = useState(thirtyOneDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [error, setError] = useState('');

  const [selectedTransaction, setSelectedTransaction] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions?.filter((t) => {
      const typeMatch = 
        filters.includes('all') || 
        filters.includes('sender') && (t.type === 'Sender') || 
        filters.includes('debt') && (t.type === 'Sender (Debt)' || t.type === 'Recipient (Debt)') || 
        filters.includes('recipient') && (t.type === 'Recipient' || t.type === 'Deposit');

      const startDateMatch = !startDate || new Date(t.transaction_time).setHours(0, 0, 0, 0) >= startDate.setHours(0, 0, 0, 0);
      const endDateMatch = !endDate || new Date(t.transaction_time).setHours(0, 0, 0, 0) <= endDate.setHours(0, 0, 0, 0);
      return typeMatch && startDateMatch && endDateMatch;
    });
  }, [transactions, filters, startDate, endDate]);

  useEffect(() => {
    if (transactions == null || status == IDLE) {
      dispatch(getAccountTransactions());
      dispatch(getBanks());
    }
  }, [transactions, status]);

  const renderTransactions = () => {
    if (status === SUCCEEDED) {
      if (filteredTransactions?.length === 0) {
        return <p className="text-center text-gray-500">Không có giao dịch nào trong khoảng thời gian này</p>;
      }

      return (
        <div className="max-h-96 overflow-y-auto">
          {filteredTransactions?.map((transaction) => {
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

            const bank = banks.find(bank => bank.id === bankId);
            const bankLogo = bank?.logo;

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

            const isInternalTransaction = transaction.type === 'Deposit' || (transaction.id_sender_bank === 1 && transaction.id_recipient_bank === 1);
            const transactionBgColor = isInternalTransaction ? 'bg-white' : 'bg-red-100';

            const formattedAmount = new Intl.NumberFormat().format(transaction.transaction_amount);
            const formattedBalance = new Intl.NumberFormat().format(transaction.current_balance);

            return (
              <div
                key={uniqueKey}
                className={`p-4 border-b border-gray-300 flex items-center justify-between cursor-pointer ${transactionBgColor}`}
                onClick={() => handleTransactionClick(transaction)}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={bankLogo ? bankLogo : `https://picsum.photos/id/155/200/300`}
                    alt="Bank Logo"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{transaction.transaction_message || transaction.deposit_message || "(Không có nội dung)"}</p>
                    <span className="text-sm text-gray-700 mr-5">{formattedTime}</span>
                    <span className="text-sm">Số dư: {formattedBalance} VNĐ</span>
                  </div>
                </div>
                <div className='amount w-60 text-right'>
                  <p className={`text-lg ${amountSign === '+' ? 'text-green-600' : 'text-red-600'}`}>
                    {amountSign}{formattedAmount} VNĐ
                  </p>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <div className={`ml-4 py-1 px-2 text-xs font-base rounded text-white ${labelColor}`}>
                    {transactionLabel}
                  </div>
                  {!isInternalTransaction ? (
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-red-600 rounded-full mt-0.5"></span>
                      <span className="text-xs text-red-600">Giao dịch liên ngân hàng</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-white rounded-full mt-0.5"></span>
                      <span className="text-xs text-white">Giao dịch liên ngân hàng</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false); 
    setSelectedTransaction(null);
  };

  const validateDateRange = (start, end) => {
    const diffInDays = (end - start) / (1000 * 3600 * 24);
    return diffInDays < 30;
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (!validateDateRange(date, endDate)) {
      setError('Khoảng thời gian tra cứu không được vượt quá 30 ngày');
    } else {
      setError('');
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (!validateDateRange(startDate, date)) {
      setError('Khoảng thời gian tra cứu không được vượt quá 30 ngày');
    } else {
      setError('');
    }
  };

  const handleFilterButtonClick = (filter) => {
    setFilters((prev) => {
      const newFilters = prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter];
  
      if (!newFilters.includes('recipient') && !newFilters.includes('sender') && !newFilters.includes('debt')) {
        return ['all'];
      }
  
      return newFilters.includes('all') ? newFilters.filter((f) => f !== 'all') : newFilters;
    });
  };

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
                className={`w-full p-3 border border-gray-300 rounded-xl`}
                wrapperClassName="react-datepicker-wrapper w-full"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-500 mb-2">Đến ngày</label>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                dateFormat="dd/MM/yyyy"
                className={`w-full p-3 border border-gray-300 rounded-xl`}
                wrapperClassName="react-datepicker-wrapper w-full"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            className={`flex items-center gap-2 py-2 px-4 rounded-xl ${filters.includes('recipient') ? 'bg-green-500 hover:bg-green-400' : 'bg-gray-200'
              } text-white`}
              onClick={() => handleFilterButtonClick('recipient')}
          >
            <BanknotesIcon className="w-6 h-6" />
            Nhận tiền
          </button>
          <button
            className={`flex items-center gap-2 py-2 px-4 rounded-xl ${filters.includes('sender') ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-gray-200'
              } text-white`}
              onClick={() => handleFilterButtonClick('sender')}
          >
            <ArrowsRightLeftIcon className="w-6 h-6" />
            Chuyển tiền
          </button>
          <button
            className={`flex items-center gap-2 py-2 px-4 rounded-xl ${filters.includes('debt') ? 'bg-blue-500 hover:bg-blue-400' : 'bg-gray-200'
              } text-white`}
              onClick={() => handleFilterButtonClick('debt')}
          >
            <CreditCardIcon className="w-6 h-6" />
            Thanh toán nợ
          </button>
          <button
            className={`flex items-center gap-2 py-2 px-4 rounded-xl ${
              filters.includes('all') ? 'bg-red-800 hover:bg-red-700' : 'bg-gray-200'
            } text-white`}
            onClick={() => setFilters(['all'])}
          >
            Tất cả
          </button>
        </div>
        <p className="text-sm text-right">
          <span className="text-red-600">Quý khách lưu ý:</span> Thời gian tìm kiếm giới hạn trong 30 ngày
        </p>
      </div>

      <div className="mt-1 p-6 bg-white rounded-xl">{renderTransactions()}</div>
      <TransactionDetailModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        transaction={selectedTransaction}
        account_number={account_number}
        bankName={
          selectedTransaction
            ? selectedTransaction.type === 'Deposit'
              ? null
              : selectedTransaction.type === 'Sender' || selectedTransaction?.type === 'Sender (Debt)'
              ? banks[selectedTransaction?.id_recipient_bank]?.name
              : banks[selectedTransaction?.id_sender_bank]?.name
            : null
        }
      />
    </>
  );
}
