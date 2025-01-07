import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowsRightLeftIcon, BanknotesIcon, CreditCardIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getBankName, getExternalTransactions } from '../../../redux/transactionThunk';
import { IDLE, SUCCEEDED } from '../../../util/config';
import { format } from 'date-fns';
import TransactionDetailModal from '../../../components/EmployeeMgmt/TransactionDetailModal';

const BankTransferHistory = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
  const [selectedBank, setSelectedBank] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [filters, setFilters] = useState(['all']);
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { transactions, banks, status } = useSelector((state) => state.transaction);
  
  useEffect(() => {
    if (status === IDLE) {
      dispatch(getExternalTransactions());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (transactions) {
      const sortedTransactions = [...transactions].sort((a, b) => new Date(b.transaction_time) - new Date(a.transaction_time));
      setSortedTransactions(sortedTransactions);
    }
  }, [transactions]);

  useEffect(() => {
    const applyFilters = () => {
      const newFilteredTransactions = sortedTransactions.filter((t) => {
        const typeMatch =
          filters.includes('all') ||
          (filters.includes('sender') && t.type === 'Sender') ||
          (filters.includes('recipient') && (t.type === 'Recipient'));
  
        const startDateMatch = !startDate || new Date(t.transaction_time) >= startDate;
        const endDateMatch = !endDate || new Date(t.transaction_time) <= endDate;
  
        return typeMatch && startDateMatch && endDateMatch;
      });
  
      setFilteredTransactions(newFilteredTransactions);
    };
  
    if (status === SUCCEEDED && transactions.length > 0) {
      applyFilters();
    }
  }, [sortedTransactions, filters, startDate, endDate, status]);

  useEffect(() => {
    filteredTransactions.forEach((transaction) => {
      const bankId = transaction.id_sender_bank === 1 ? transaction.id_recipient_bank : transaction.id_sender_bank;
  
      if (bankId && !banks[bankId]) {
        dispatch(getBankName(bankId));
      }
      });
    }, [sortedTransactions, banks, dispatch]);
  
  const renderTransactions = () => {
      if (status === SUCCEEDED) {
        if (filteredTransactions.length === 0) {
          return <p className="text-center text-gray-500">Không có giao dịch nào trong khoảng thời gian này</p>;
        }
  
        return (
          <div className="max-h-96 overflow-y-auto">
            {filteredTransactions.map((transaction) => {
              const formattedTime = format(new Date(transaction.transaction_time), 'dd/MM/yyyy - HH:mm:ss');
              const amountSign = transaction.type === 'Sender' ? '-' : '+';
  
              let bankId;
              if (transaction.type === 'Recipient') {
                bankId = transaction.id_sender_bank;
              } else if (transaction.type === 'Sender') {
                bankId = transaction.id_recipient_bank;
              }
  
              const bankName = banks[bankId]?.name;
              const bankLogo = banks[bankId]?.logo;
  
              let transactionLabel = '';
              let labelColor = '';
  
              if (transaction.type === 'Recipient') {
                transactionLabel = 'Nhận tiền';
                labelColor = 'bg-green-500';
              } else if (transaction.type === 'Sender') {
                transactionLabel = 'Chuyển tiền';
                labelColor = 'bg-yellow-500';
              }
  
              const formattedAmount = new Intl.NumberFormat().format(transaction.transaction_amount);
  
              return (
                <div
                  key={transaction.id}
                  className={`p-4 border-b border-gray-300 flex items-center justify-between cursor-pointer`}
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={bankLogo ? bankLogo : `https://logo.clearbit.com/${bankName}.com`}
                      alt="Bank Logo"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{transaction.transaction_message || '(Không có nội dung)'}</p>
                      <span className="text-sm text-gray-700 mr-5">{formattedTime}</span>
                      
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

    const handleFilterButtonClick = (filter) => {
      setFilters((prev) => {
        const newFilters = prev.includes(filter)
          ? prev.filter((f) => f !== filter)
          : [...prev, filter];
  
        if (!newFilters.includes('recipient') && !newFilters.includes('sender')) {
          return ['all'];
        }
  
        return newFilters.includes('all') ? newFilters.filter((f) => f !== 'all') : newFilters;
      });
    };
  // return (
  //   <div className="mx-auto w-full max-w-4xl flex flex-col gap-6">
  //     <h2 className="text-xl font-bold">Lịch sử giao dịch với ngân hàng khác</h2>

  //     <div className="flex gap-4 items-center">
  //       <div className="grid grid-cols-3 gap-4">
  //         <div>
  //           <label className="block text-base font-medium mb-2">Từ ngày</label>
  //           <DatePicker
  //             selected={startDate}
  //             onChange={(date) => setStartDate(date)}
  //             dateFormat="dd/MM/yyyy"
  //             className={`w-full p-3 border border-gray-300 rounded-xl`}
  //             wrapperClassName="react-datepicker-wrapper w-full"
  //           />
  //         </div>
        
  //         <div>
  //           <label className="block text-base font-medium mb-2">Đến ngày</label>
  //           <DatePicker
  //             selected={endDate}
  //             onChange={(date) => setEndDate(date)}
  //             dateFormat="dd/MM/yyyy"
  //             className={`w-full p-3 border border-gray-300 rounded-xl`}
  //             wrapperClassName="react-datepicker-wrapper w-full"
  //           />
  //         </div>

  //         <div>
  //           <label className="block text-base font-medium mb-2">Ngân hàng</label>
  //           <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl">
  //             <option value="">Tất cả</option>
  //             {Object.keys(banks).map((bankId) => {
  //               const bank = banks[bankId]; 
  //               return (
  //                 <option key={bankId} value={bankId}>
  //                   {bank.name}
  //                 </option>
  //               );
  //             })}
  //           </select>
  //         </div>
  //       </div>
  //     </div>

  //     <div className="text-lg font-semibold">Tổng số tiền giao dịch: {totalAmount} VNĐ</div>
  //     <TransferHistory />
  //     {/* <div className="bg-white shadow-lg p-4 rounded-xl w-full">
  //       <TransactionTable transactions={sortedTransactions} banks={banks}/>
  //     </div> */}

  //   </div>
  // );
  return (
    <>
      <div className="mx-auto w-full max-w-4xl flex flex-col gap-6">
        <h2 className="text-xl font-bold">Lịch sử giao dịch với ngân hàng khác</h2>
        <div className="p-6 bg-white rounded-xl space-y-4">
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-base font-medium mb-2">Ngân hàng</label>
              <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl">
                <option value="">Tất cả</option>
                {Object.keys(banks).map((bankId) => {
                  const bank = banks[bankId]; 
                  return (
                    <option key={bankId} value={bankId}>
                      {bank.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-gray-500 mb-2">Từ ngày</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className={`w-full p-3 border border-gray-300 rounded-xl`}
                  wrapperClassName="react-datepicker-wrapper w-full"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-500 mb-2">Đến ngày</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className={`w-full p-3 border border-gray-300 rounded-xl`}
                  wrapperClassName="react-datepicker-wrapper w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {transactions.length > 0 && (
        <>
          <div className="flex justify-end mt-4 gap-2">
            <button
              className={`flex items-center gap-2 py-2 px-4 rounded-xl ${filters.includes('recipient') ? 'bg-green-500 hover:bg-green-400' : 'bg-gray-200'} text-white`}
              onClick={() => handleFilterButtonClick('recipient')}
            >
              <BanknotesIcon className="w-6 h-6" />
              Nhận tiền
            </button>
            <button
              className={`flex items-center gap-2 py-2 px-4 rounded-xl ${filters.includes('sender') ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-gray-200'} text-white`}
              onClick={() => handleFilterButtonClick('sender')}
            >
              <ArrowsRightLeftIcon className="w-6 h-6" />
              Chuyển tiền
            </button>
            <button
              className={`flex items-center gap-2 py-2 px-4 rounded-xl ${filters.includes('all') ? 'bg-red-700 hover:bg-red-800' : 'bg-gray-200'} text-white`}
              onClick={() => setFilters(['all'])}
            >
              Tất cả
            </button>
          </div>
          <div className="text-lg font-semibold">Tổng số tiền giao dịch: {totalAmount} VNĐ</div>
          <div className="my-4 p-6 bg-white rounded-xl">{renderTransactions()}</div>
        </>
        )}


        {/* <TransactionDetailModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          transaction={selectedTransaction}
          account_number={inputAccountNumber}
          bankName={
            selectedTransaction
              ? selectedTransaction.type === 'Deposit'
                ? null
                : selectedTransaction.type === 'Sender' || selectedTransaction?.type === 'Sender (Debt)'
                  ? banks[selectedTransaction?.id_recipient_bank]?.name
                  : banks[selectedTransaction?.id_sender_bank]?.name
              : null
          }
        /> */}
      </div>
    </>
  );
};

export default BankTransferHistory;