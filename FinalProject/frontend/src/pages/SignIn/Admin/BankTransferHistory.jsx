import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { getExternalTransactions } from '../../../redux/transactionThunk';
import { IDLE, SUCCEEDED } from '../../../util/config';
import TransactionTable from '../../../components/Table/TransactionTable';

const BankTransferHistory = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
  const [selectedBank, setSelectedBank] = useState('');
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);
  const [totalAmountSent, setTotalAmountSent] = useState(0);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const { transactions, banks, status } = useSelector((state) => state.transaction);
  
  useEffect(() => {
    if (status === IDLE) {
      dispatch(getExternalTransactions());
    }
  }, [dispatch, status]);

  useEffect(() => {
    const applyFilters = () => {
      const newFilteredTransactions = transactions.filter((t) => {  
        const startDateMatch = !startDate || new Date(t.transaction_time).setHours(0, 0, 0, 0) >= startDate.setHours(0, 0, 0, 0);
        const endDateMatch = !endDate || new Date(t.transaction_time).setHours(0, 0, 0, 0) <= endDate.setHours(0, 0, 0, 0);
        const bankMatch = !selectedBank || 
          (t.id_sender_bank === 1 ? t.id_recipient_bank === parseInt(selectedBank) : t.id_sender_bank === parseInt(selectedBank));
  
        return startDateMatch && endDateMatch && bankMatch;
      });
      
      let totalAmountReceived = 0;
      let totalAmountSent = 0;
      
      newFilteredTransactions.forEach((transaction) => {
        if (transaction.id_sender_bank === 1) {
          
          totalAmountSent += parseInt(transaction.transaction_amount);
        } else {
          totalAmountReceived += parseInt(transaction.transaction_amount);
        }
      });
      
      setTotalAmountReceived(totalAmountReceived);
      setTotalAmountSent(totalAmountSent);
      setFilteredTransactions(newFilteredTransactions);
    };
  
    if (status === SUCCEEDED && transactions.length > 0) {
      applyFilters();
    }
  }, [transactions, startDate, endDate, selectedBank, status]);

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

  return (
    <>
      <div className="mx-auto w-full max-w-screen-xl flex flex-col gap-6">
        <h2 className="text-xl font-bold">Lịch sử giao dịch với ngân hàng khác</h2>
        <div className="p-6 bg-white rounded-xl">   
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-base font-medium mb-2">Ngân hàng</label>
              <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl">
                <option value="">Tất cả</option>
                {banks && banks.filter(bank => bank.id !== 1).map((bank) => {
                  return (
                    <option key={bank.id} value={bank.id}>
                      {bank.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-base font-medium mb-2">Từ ngày</label>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                dateFormat="dd/MM/yyyy"
                className={`w-full p-3 border border-gray-300 rounded-xl`}
                wrapperClassName="react-datepicker-wrapper w-full"
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-2">Đến ngày</label>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                dateFormat="dd/MM/yyyy"
                className={`w-full p-3 border border-gray-300 rounded-xl`}
                wrapperClassName="react-datepicker-wrapper w-full"
              />
            </div> 
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          {/* <div className="text-base font-medium">Tổng số tiền đã giao dịch: {new Intl.NumberFormat().format(totalAmount)} VNĐ</div> */}
          <div className="mt-4 text-base font-medium">Tổng số tiền đã chuyển: {new Intl.NumberFormat().format(totalAmountSent)} VNĐ</div>
          <div className="mt-1 mb-4 text-base font-medium">Tổng số tiền đã nhận: {new Intl.NumberFormat().format(totalAmountReceived)} VNĐ</div>
          <TransactionTable transactions={filteredTransactions} banks={banks}/>
        </div>
      </div>
    </>
  );
};

export default BankTransferHistory;