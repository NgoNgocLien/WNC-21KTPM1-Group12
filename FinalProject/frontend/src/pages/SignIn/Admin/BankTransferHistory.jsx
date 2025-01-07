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
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [error, setError] = useState('');
  const [error, setError] = useState('');

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
      
      setTotalAmount(totalAmountReceived - totalAmountSent);
      setFilteredTransactions(newFilteredTransactions);
    };
  
    if (status === SUCCEEDED && transactions.length > 0) {
      applyFilters();
    }
  }, [sortedTransactions, startDate, endDate, selectedBank, status]);
  }, [sortedTransactions, startDate, endDate, selectedBank, status]);

  useEffect(() => {
    filteredTransactions.forEach((transaction) => {
      const bankId = transaction.id_sender_bank === 1 ? transaction.id_recipient_bank : transaction.id_sender_bank;
  
      if (bankId && !banks[bankId]) {
        dispatch(getBankName(bankId));
      }
    });
  }, [filteredTransactions, banks, dispatch]);

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
    });
  }, [filteredTransactions, banks, dispatch]);

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
        <div className="p-6 bg-white rounded-xl space-y-7">   
          <div className="grid grid-cols-3 gap-4">
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

            <div>
              <label className="block text-base font-medium mb-2">Từ ngày</label>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
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
                onChange={handleEndDateChange}
                dateFormat="dd/MM/yyyy"
                className={`w-full p-3 border border-gray-300 rounded-xl`}
                wrapperClassName="react-datepicker-wrapper w-full"
              />
            </div> 
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="text-base font-medium">Tổng số tiền đã giao dịch: {new Intl.NumberFormat().format(totalAmount)} VNĐ</div>
          <TransactionTable transactions={filteredTransactions} banks={banks}/>
        </div>
      </div>
    </>
  );
};

export default BankTransferHistory;