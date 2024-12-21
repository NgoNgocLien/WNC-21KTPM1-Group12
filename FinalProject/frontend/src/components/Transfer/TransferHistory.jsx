import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { FaMoneyBillAlt, FaExchangeAlt, FaRegCreditCard } from 'react-icons/fa';
import { ArrowsRightLeftIcon, BanknotesIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { fetchAccountTransactions, fetchBankName } from '../../redux/transactionThunk';
import { IDLE, LOADING, FAILED, SUCCEEDED } from '../../util/config';
import { format } from 'date-fns';

export default function TransferHistory() {
  const dispatch = useDispatch();
  const { transactions, banks, status, error } = useSelector((state) => state.transaction);
  
  const [filter, setFilter] = useState('all');
  
  const filteredTransactions = useMemo(() => {
    switch (filter) {
      case 'transfer':
        return transactions.filter((t) => t.type === 'Sender');
      case 'receive':
        return transactions.filter((t) => t.type === 'Recipient' || t.type === 'Deposit');
      case 'debt':
        return transactions.filter((t) => t.type === 'Sender (Debt)' || t.type === 'Recipient (Debt)');
      default:
        return transactions;
    }
  }, [filter, transactions]);

  useEffect(() => {
    if (status === IDLE) {
      dispatch(fetchAccountTransactions());
    }
  }, [dispatch, status]);

  useEffect(() => {
    filteredTransactions.forEach((transaction) => {
      let bankId = null;
      if (transaction.type === 'Sender') {
        bankId = transaction.id_recipient_bank;
      } else if (transaction.type === 'Recipient') {
        bankId = transaction.id_sender_bank;
      } else if (transaction.type === 'Sender (Debt)') {
        bankId = transaction.id_recipient_bank;
      } else if (transaction.type === 'Recipient (Debt)') {
        bankId = transaction.id_sender_bank;
      }

      if (bankId && !banks[bankId]) {
        dispatch(fetchBankName(bankId));
      }
    });
  }, [filteredTransactions, banks, dispatch]);

  const renderTransactions = () => {
    if (status === SUCCEEDED) {
      return (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => {
            let transactionInfo = '';
            let bankName = '';
            let icon = null;

            if (transaction.type === 'Sender') {
              transactionInfo = `Chuyển tiền đến ${transaction.recipient_account_number}`;
              icon = <ArrowsRightLeftIcon className="w-6 h-6" />;
              const bankId = transaction.id_recipient_bank;
              bankName = banks[bankId]?.name || 'Đang tải...';
            } else if (transaction.type === 'Recipient') {
              transactionInfo = `Nhận tiền từ ${transaction.recipient_name}`;
              icon = <BanknotesIcon className="w-6 h-6" />;
              const bankId = transaction.id_sender_bank;
              bankName = banks[bankId]?.name || 'Đang tải...';
            } else if (transaction.type === 'Deposit') {
              transactionInfo = `Nạp tiền vào tài khoản`;
              icon = <BanknotesIcon className="w-6 h-6" />;
            } else if (transaction.type === 'Sender (Debt)') {
              transactionInfo = `Thanh toán cho ${transaction.recipient_account_number}`;
              icon = <CreditCardIcon className="w-6 h-6" />;
              const bankId = transaction.id_recipient_bank;
              bankName = banks[bankId]?.name || 'Đang tải...';
            } else if (transaction.type === 'Recipient (Debt)') {
              transactionInfo = `Thanh toán từ ${transaction.recipient_name}`;
              icon = <CreditCardIcon className="w-6 h-6" />;
              const bankId = transaction.id_sender_bank;
              bankName = banks[bankId]?.name || 'Đang tải...';
            }

            const uniqueKey = `${transaction.type}-${transaction.id}`;
            const formattedTime = format(new Date(transaction.transaction_time), 'HH:mm - dd/MM/yyyy');
            const transactionAmount = transaction.transaction_amount;
            const amountSign = transaction.type === 'Sender' || transaction.type === 'Sender (Debt)' ? '-' : '+';

            return (
              <div key={uniqueKey} className="p-4 border-b border-gray-300 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>{icon}</div>
                  <div>
                    <p className="font-semibold">{transactionInfo}</p>
                    <p className="text-sm text-gray-600">{bankName}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{formattedTime}</p>
                  </div>
                  <div className={`text-xl ${amountSign === '+' ? 'text-green-600' : 'text-red-600'}`}>
                    {amountSign} {transactionAmount} VND
                  </div>
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
      <p className="text-lg font-semibold">Lịch sử giao dịch</p>

      <div className="p-4 bg-white rounded-lg">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold text-red-800">{filteredTransactions.length} giao dịch</p>
          <div className="flex space-x-2">
            <button 
              className={`flex items-center gap-2 p-2 h-fit rounded-lg ${filter === 'receive' ? 'bg-green-500' : 'bg-gray-200'} text-white`}
              onClick={() => setFilter('receive')}>
              <BanknotesIcon className='w-6 h-6 p-0 m-0' />
              Nhận tiền
            </button>
            <button 
              className={`flex items-center gap-2 p-2 h-fit rounded-lg ${filter === 'transfer' ? 'bg-yellow-500' : 'bg-gray-200'} text-white`}
              onClick={() => setFilter('transfer')}>
              <ArrowsRightLeftIcon className='w-6 h-6 p-0 m-0' />
              Chuyển tiền
            </button>
            <button 
              className={`flex items-center gap-2 p-2 h-fit rounded-lg ${filter === 'debt' ? 'bg-blue-500' : 'bg-gray-200'} text-white`} 
              onClick={() => setFilter('debt')}
            >
              <CreditCardIcon className="w-6 h-6 p-0 m-0" />
              Thanh toán nợ
            </button>
            <button 
              className={`flex items-center gap-2 p-2 h-fit rounded-lg ${filter === 'all' ? 'bg-red-500' : 'bg-gray-200'} text-white`} 
              onClick={() => setFilter('all')}
            >
              Tất cả
            </button>
          </div>
        </div>
      </div>
      {renderTransactions()}
    </>
  );
}
