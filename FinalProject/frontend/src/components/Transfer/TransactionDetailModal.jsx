import React from 'react';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';

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
    feePayer = 'Người gửi trả phí';
  } else if (feePaymentMethod === 'RECIPIENT') {
    feePayer = 'Người nhận trả phí';
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-xl rounded-lg w-11/12 max-w-lg p-6">
        <div className="flex justify-center items-center pb-4 mb-4">
          <h3 className="text-xl font-semibold text-black">Chi tiết giao dịch</h3>
        </div>

        <div className="grid grid-cols-2 gap-y-4">
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
                {transaction.type === 'Sender' || transaction.type === 'Sender (Debt)' ? 'Tài khoản thụ hưởng' : 'Tài khoản gửi'}
              </div>
              <div className="text-gray-800 font-medium">{recipientAccount}</div>

              {(transaction.type === 'Sender' || transaction.type === 'Sender (Debt)') && (
                <>
                  <div className="text-gray-600 font-base">Người thụ hưởng</div>
                  <div className="text-gray-800 font-medium">{recipientName}</div>
                </>
              )}

              <div className="text-gray-600 font-base">Ngân hàng</div>
              <div className="text-gray-800 font-medium">{bankName}</div>
            </>
          )}

          {transaction.type !== 'Deposit' && feePayer && (
            <>
              <div className="text-gray-600 font-base">Phí</div>
              <div className="text-gray-800 font-medium">{feePayer}</div>
            </>
          )}

          <div className="text-gray-600 font-base">Nội dung giao dịch</div>
          <div className="text-gray-800 font-medium">
            {transaction.transaction_message || transaction.deposit_message || "(Không có nội dung)"} 
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={closeModal}
            className="py-2 px-4 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
