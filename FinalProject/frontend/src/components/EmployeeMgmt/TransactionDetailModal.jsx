import React from 'react';
import { format } from 'date-fns';
import { IoIosClose } from 'react-icons/io'

const TransactionDetailModal = ({ isOpen, closeModal, transaction, banks }) => {
  if (!isOpen || !transaction) return null;

  const formattedTime = format(new Date(transaction.transaction_time), 'dd/MM/yyyy - HH:mm:ss');
  const formattedAmount = new Intl.NumberFormat().format(transaction.transaction_amount);
  const feePaymentMethod = transaction.fee_payment_method;
  let feePayer = '';
  if (feePaymentMethod === 'SENDER') {
    feePayer = 'Người gửi trả phí';
  } else if (feePaymentMethod === 'RECIPIENT') {
    feePayer = 'Người nhận trả phí';
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

          <div className="text-gray-600 font-base">Thời gian giao dịch</div>
          <div className="text-gray-800 font-medium">{formattedTime}</div>

          <div className="text-gray-600 font-base">Tài khoản người gửi</div>
          <div className="text-gray-800 font-medium">
            {transaction.sender_account_number} - {transaction.id_sender_bank === 1 ? "NoMeoBank" : banks[transaction.id_sender_bank]?.name}
          </div>

          <div className="text-gray-600 font-base">Tài khoản người nhận</div>
          <div className="text-gray-800 font-medium">
            {transaction.recipient_name} - {transaction.recipient_account_number} - {transaction.id_recipient_bank === 1 ? "NoMeoBank" : banks[transaction.id_recipient_bank]?.name}
          </div>
          <div className="text-gray-600 font-base">Số tiền giao dịch</div>
          <div className="text-gray-800 font-medium">{formattedAmount} VNĐ</div>

          <div className="text-gray-600 font-base">Phí</div>
          <div className="text-gray-800 font-medium">{feePayer}</div>

          <div className="text-gray-600 font-base">Nội dung giao dịch</div>
          <div className="text-gray-800 font-medium">
            {transaction.transaction_message || "(Không có nội dung)"} 
          </div>

        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
