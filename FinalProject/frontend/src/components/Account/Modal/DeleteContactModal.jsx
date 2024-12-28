import React from 'react';
import { useDispatch } from 'react-redux'
import { IoIosClose } from "react-icons/io";

import { deleteOneContact } from './../../../redux/userThunk';

const DeleteContactModal = ({ isOpen, closeModal, contact }) => {
  const dispatch = useDispatch();

  if (!isOpen || !contact) return null;

  const handleDelete = (contact) => {
    console.log('Deleted contact:', contact);
    dispatch(deleteOneContact(contact.id))
};

  return (

    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className={`bg-white rounded-lg shadow-xl w-96`}>
    
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className={`text-xl font-semibold`}>Xác nhận</h3>
                <IoIosClose className="text-gray-500 text-3xl cursor-pointer hover:text-gray-700" onClick={closeModal} />
              </div>
              <p className={`mt-2`}>Bạn có chắc chắn muốn xóa <span className="font-semibold">{contact.nickname}</span>?</p>
            </div>
    
            <div className="flex justify-center p-4 space-x-4">
              <button
                onClick={closeModal}
                className={`px-4 py-2 bg-white text-red-800 border-2 border-red-800 rounded-xl hover:bg-red-100`}
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleDelete(contact); // handle delete logic
                  closeModal();
                }}
                className={`px-4 py-2 bg-red-800 text-white rounded-xl hover:bg-red-700`}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
  );
};

export default DeleteContactModal;
