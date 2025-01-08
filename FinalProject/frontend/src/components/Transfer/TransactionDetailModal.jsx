import React from 'react';
import { IoIosClose } from 'react-icons/io'

import { format } from 'date-fns';

const TransactionDetailModal = ({ isOpen, closeModal, transaction, account_number, bankName }) => {
  if (!isOpen || !transaction) return null;

  const formattedTime = format(new Date(transaction.transaction_time), 'dd/MM/yyyy - HH:mm:ss');
  const formattedAmount = new Intl.NumberFormat().format(transaction.transaction_amount);
  const formattedBalance = new Intl.NumberFormat().format(transaction.current_balance);
  const feePaymentMethod = transaction.fee_payment_method;

  let recipientAccount = '';
  let recipientName = '';
  let feePayer = '';

  if (transaction.type === 'Sender' || transaction.type === 'Sender (Debt)') {
    recipientAccount = transaction.recipient_account_number;
    recipientName = transaction.recipient_name;
  } else if (transaction.type === 'Recipient' || transaction.type === 'Recipient (Debt)') {
    recipientAccount = transaction.sender_account_number;
  }

  if (feePaymentMethod === 'SENDER') {
    feePayer = '(Người gửi trả phí)';
  } else if (feePaymentMethod === 'RECIPIENT') {
    feePayer = '(Người nhận trả phí)';
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-xl rounded-lg w-11/12 max-w-lg p-6 pb-8">
        <div className="flex justify-between items-center pb-4 mb-4">
          <h3 className="text-xl font-semibold text-black">Chi tiết giao dịch</h3>
          <IoIosClose className="text-gray-500 text-3xl cursor-pointer hover:text-gray-700" onClick={closeModal} />
        </div>

        <div className="grid grid-cols-2 gap-y-4">
          <div className="text-gray-600 font-base">Mã giao dịch</div>
          <div className="text-gray-800 font-medium">{transaction.id}</div>

          <div className="text-gray-600 font-base">Tài khoản nguồn</div>
          <div className="text-gray-800 font-medium">{account_number}</div>

          <div className="text-gray-600 font-base">Thời gian giao dịch</div>
          <div className="text-gray-800 font-medium">{formattedTime}</div>

          <div className="text-gray-600 font-base">Số tiền giao dịch</div>
          <div className="text-gray-800 font-medium">{formattedAmount} VNĐ</div>

          <div className="text-gray-600 font-base">Số dư sau giao dịch</div>
          <div className="text-gray-800 font-medium">{formattedBalance} VNĐ</div>

          {transaction.type !== 'Deposit' && (
            <>
              <div className="text-gray-600 font-base">
                {transaction.type === 'Sender' || transaction.type === 'Sender (Debt)' ? 'Tài khoản nhận' : 'Tài khoản gửi'}
              </div>
              <div className="text-gray-800 font-medium">{recipientName ? `${recipientName} - ` : "" }{recipientAccount} - {bankName}</div>
            </>
          )}

          {transaction.type !== 'Deposit' && feePayer && (
            <>
              <div className="text-gray-600 font-base">Phí giao dịch</div>
              <div className="text-gray-800 font-medium">{new Intl.NumberFormat().format(transaction.fee_amount)} VNĐ {feePayer}</div>
            </>
          )}

          <div className="text-gray-600 font-base">Nội dung giao dịch</div>
          <div className="text-gray-800 font-medium">
            {transaction.transaction_message || transaction.deposit_message || "(Không có nội dung)"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
