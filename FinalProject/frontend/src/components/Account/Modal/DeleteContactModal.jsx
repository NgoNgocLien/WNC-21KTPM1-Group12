import React from 'react';
import { useDispatch } from 'react-redux'
import { deleteOneContact } from './../../../redux/userThunk';

const DeleteContactModal = ({ isOpen, closeModal, contact }) => {
  const dispatch = useDispatch();

  if (!isOpen || !contact) return null;

  const handleDelete = (contact) => {
    console.log('Deleted contact:', contact);
    dispatch(deleteOneContact(contact.id))
};

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl text-center font-semibold">Xác Nhận Xóa Người Nhận</h3>
        <p className="text-cente mb-4">Bạn có chắc chắn muốn xóa <span className="font-semibold">{contact.nickname}</span>?</p>
        <div className="flex justify-center space-x-4 mt-4">
          <button 
            onClick={closeModal} 
            className="px-4 py-2 bg-white text-red-800 border-2 border-red-800 rounded-lg hover:bg-red-100">Hủy</button>
          <button
            onClick={() => {
              handleDelete(contact); // handle delete logic
              closeModal();
            }}
            className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteContactModal;
