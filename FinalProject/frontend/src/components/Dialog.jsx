import React from 'react';
import { IoIosClose } from "react-icons/io";

const Dialog = ({ isOpen, onClose, type, message, actionBtn }) => {
  const getDialogStyles = () => {
    switch (type) {
      case 'success':
        return {
          title: "Thành công"
        };
      case 'error':
        return {
          title: "Lỗi"
        };
      case 'confirm':
        return {
          title: "Xác nhận"
        };
      case 'info':
      default:
        return {
          title: "Thông tin"
        };
    }
  };

  if (!isOpen) return null;

  const { title } = getDialogStyles();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-xl w-96`}>

        <div className="p-4">
          <div className="flex justify-between items-center">
            <h3 className={`text-xl font-semibold`}>{title}</h3>
            <IoIosClose className="text-gray-500 text-3xl cursor-pointer hover:text-gray-700" onClick={onClose} />
          </div>
          <p className={`mt-2`}>{message}</p>
        </div>

        <div className="flex justify-center p-4">
          {
            actionBtn ? (
              <>
                <button
                  onClick={onClose}
                  className={`px-4 py-2 bg-white text-red-800 border-2 border-red-800 rounded-xl hover:bg-red-100`}
                >
                  Đóng
                </button>
                <button
                  onClick={onClose}
                  className={`px-4 py-2 bg-red-800 text-white rounded-xl hover:bg-red-700`}
                >
                  {actionBtn}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className={`px-4 py-2 bg-red-800 text-white rounded-xl hover:bg-red-700`}
              >
                Đóng
              </button>
            )
          }

        </div>
      </div>
    </div>
  );
};

export default Dialog;
