import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { getBankName, getExternalTransactions } from '../../../redux/transactionThunk';
import { IDLE, SUCCEEDED } from '../../../util/config';
import TransactionTable from '../../../components/Table/TransactionTable';

const BankTransferHistory = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
  const [selectedBank, setSelectedBank] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  const dispatch = useDispatch();
  const { transactions, banks, status } = useSelector((state) => state.transaction);
  
  useEffect(() => {
    if (status === IDLE) {
      dispatch(getExternalTransactions());
    }
  }, [dispatch, status]);

  useEffect(() => {
    transactions.forEach((transaction) => {
      const bankId = transaction.id_sender_bank === 1 ? transaction.id_recipient_bank : transaction.id_sender_bank;
  
      if (bankId && !banks[bankId]) {
        dispatch(getBankName(bankId));
      }
      });
    }, [transactions, banks, dispatch]);

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.transaction_time) - new Date(a.transaction_time));
  
  return (
    <div className="mx-auto w-full max-w-4xl flex flex-col gap-6">
      <h2 className="text-xl font-bold">Lịch sử giao dịch với ngân hàng khác</h2>

      <div className="flex gap-4 items-center">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-base font-medium mb-2">Từ ngày</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className={`w-full p-3 border border-gray-300 rounded-xl`}
              wrapperClassName="react-datepicker-wrapper w-full"
            />
          </div>
        
          <div>
            <label className="block text-base font-medium mb-2">Đến ngày</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              className={`w-full p-3 border border-gray-300 rounded-xl`}
              wrapperClassName="react-datepicker-wrapper w-full"
            />
          </div>

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
        </div>
      </div>

      <div className="bg-white shadow-lg p-4 rounded-xl w-full">
        <TransactionTable transactions={sortedTransactions} banks={banks}/>
      </div>

      <div className="mt-4 text-lg font-semibold">Tổng số tiền giao dịch: {totalAmount} VNĐ</div>
    </div>
  );
};

export default BankTransferHistory;