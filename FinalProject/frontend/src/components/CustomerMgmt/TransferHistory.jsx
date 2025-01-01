import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowsRightLeftIcon, BanknotesIcon, CreditCardIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getCustomerTransactions, getBankName } from '../../redux/transactionThunk';
import { IDLE, SUCCEEDED } from '../../util/config';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import TransactionDetailModal from './TransactionDetailModal';

export default function TransferHistory() {
  const dispatch = useDispatch();
  const { transactions, banks, status } = useSelector((state) => state.transaction);
  const { customers } = useSelector((state) => state.user);

  const today = new Date();
  const thirtyOneDaysAgo = new Date();
  thirtyOneDaysAgo.setDate(today.getDate() - 29);

  const [filters, setFilters] = useState(['all']);
  const [startDate, setStartDate] = useState(thirtyOneDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [error, setError] = useState('');
  const [inputAccountNumber, setInputAccountNumber] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === SUCCEEDED && transactions.length > 0) {
      applyFilters();
    }
  }, [transactions, filters, startDate, endDate]);

  useEffect(() => {
    filteredTransactions.forEach((transaction) => {
      const bankId =
        transaction.type === 'Sender' || transaction.type === 'Sender (Debt)'
          ? transaction.id_recipient_bank
          : transaction.id_sender_bank;

      if (bankId && !banks[bankId]) {
        dispatch(getBankName(bankId));
      }
    });
  }, [filteredTransactions, banks, dispatch]);

  const handleSearch = () => {
    if (inputAccountNumber) {
      const customerExists = customers.some(
        (customer) => customer.accounts[0].account_number === inputAccountNumber
      );

      if (customerExists) {
        setError('');
        dispatch(getCustomerTransactions(inputAccountNumber));
      } else {
        setError('Số tài khoản không tồn tại');
      }
    } else {
      setError('Vui lòng nhập số tài khoản');
    }
  };

  const applyFilters = () => {
    const newFilteredTransactions = transactions.filter((t) => {
      const typeMatch =
        filters.includes('all') ||
        (filters.includes('sender') && t.type === 'Sender') ||
        (filters.includes('debt') && (t.type === 'Sender (Debt)' || t.type === 'Recipient (Debt)')) ||
        (filters.includes('recipient') && (t.type === 'Recipient' || t.type === 'Deposit'));

      const startDateMatch = !startDate || new Date(t.transaction_time) >= startDate;
      const endDateMatch = !endDate || new Date(t.transaction_time) <= endDate;

      return typeMatch && startDateMatch && endDateMatch;
    });

    setFilteredTransactions(newFilteredTransactions);
  };

  const renderTransactions = () => {
    if (status === SUCCEEDED) {
      if (filteredTransactions.length === 0) {
        return <p className="text-center text-gray-500">Không có giao dịch nào trong khoảng thời gian này</p>;
      }

      return (
        <div className="max-h-96 overflow-y-auto">
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

            const isInternalTransaction = bankId === 1;
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
                    src={bankLogo ? bankLogo : `https://logo.clearbit.com/${bankName}.com`}
                    alt="Bank Logo"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{transaction.transaction_message || transaction.deposit_message || '(Không có nội dung)'}</p>
                    <span className="text-sm text-gray-700 mr-5">{formattedTime}</span>
                    <span className="text-sm">Số dư: {formattedBalance} VNĐ</span>
                  </div>
                </div>
                <div className="amount w-60 text-right">
                  <p className={`text-lg ${amountSign === '+' ? 'text-green-600' : 'text-red-600'}`}>
                    {amountSign}{formattedAmount} VNĐ
                  </p>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <div className={`ml-4 py-1 px-2 text-xs font-base rounded text-white ${labelColor}`}>
                    {transactionLabel}
                  </div>
                  {!isInternalTransaction && (
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-red-600 rounded-full mt-0.5"></span>
                      <span className="text-xs text-red-600">Giao dịch liên ngân hàng</span>
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
    return diffInDays <= 30;
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
            <label className="block text-base font-medium text-gray-500 mb-2">Số tài khoản</label>
            <input
              type="text"
              value={inputAccountNumber}
              onChange={(e) => {
                setInputAccountNumber(e.target.value);
                setError('');
              }}
              className="w-full p-3 border border-gray-300 rounded-xl"
              placeholder="Nhập số tài khoản"
            />
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSearch}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl ${
              error ? 'bg-gray-200 text-white cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-500'
            }`}
          >
            <MagnifyingGlassIcon className="w-5 h-5"/>
            Tra cứu
          </button>
        </div>
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
              filters.includes('all') ? 'bg-red-700 hover:bg-red-800' : 'bg-gray-200'
            } text-white`}
            onClick={() => setFilters(['all'])}
          >
            Tất cả
          </button>
        </div>

      <div className="my-4">{renderTransactions()}</div>

      <TransactionDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        transaction={selectedTransaction}
      />
    </>
  );
}
