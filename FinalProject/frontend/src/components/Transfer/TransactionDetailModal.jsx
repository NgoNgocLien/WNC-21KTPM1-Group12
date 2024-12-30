import React from 'react';
import { format } from 'date-fns';

const TransactionDetailModal = ({ isOpen, closeModal, transaction }) => {
  if (!isOpen || !transaction) return null;

  const formattedTime = format(new Date(transaction.transaction_time), 'dd/MM/yyyy - HH:mm:ss');
  const formattedAmount = new Intl.NumberFormat().format(transaction.transaction_amount);
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
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="text-xl font-bold text-gray-700">Chi tiết giao dịch</h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
        </div>

        <div className="grid grid-cols-2 gap-y-4">
          <div className="text-gray-600 font-medium">Thời gian giao dịch</div>
          <div className="text-gray-900 font-semibold">{formattedTime}</div>

          <div className="text-gray-600 font-medium">Số tiền giao dịch</div>
          <div className="text-gray-900 font-semibold">{formattedAmount} VNĐ</div>

          {transaction.type !== 'Deposit' && (
            <>
              <div className="text-gray-600 font-medium">
                {transaction.type === 'Sender' || transaction.type === 'Sender (Debt)' ? 'Tài khoản nhận' : 'Tài khoản gửi'}
              </div>
              <div className="text-gray-900 font-semibold">{recipientAccount}</div>

              {(transaction.type === 'Sender' || transaction.type === 'Sender (Debt)') && (
                <>
                  <div className="text-gray-600 font-medium">Người thụ hưởng</div>
                  <div className="text-gray-900 font-semibold">{recipientName}</div>
                </>
              )}
            </>
          )}

          {transaction.type !== 'Deposit' && feePayer && (
            <>
              <div className="text-gray-600 font-medium">Phí</div>
              <div className="text-gray-900 font-semibold">{feePayer}</div>
            </>
          )}

          <div className="text-gray-600 font-medium">Nội dung giao dịch</div>
          <div className="text-gray-900 font-semibold">
            {transaction.transaction_message || transaction.deposit_message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;