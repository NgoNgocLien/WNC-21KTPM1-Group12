import React from 'react';

const DeleteContactModal = ({ isOpen, closeModal, contact }) => {
  if (!isOpen || !contact) return null;

  const handleDelete = (contact) => {
    console.log('Deleted contact:', contact);
};

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl text-center font-semibold">Xác Nhận Xóa Người Nhận</h3>
        <p className="text-center">Bạn có chắc chắn muốn xóa {contact.nickname}?</p>
        <div className="flex justify-center space-x-4 mt-4">
          <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-black rounded-lg">Hủy</button>
          <button
            onClick={() => {
              handleDelete(contact); // handle delete logic
              closeModal();
            }}
            className="px-4 py-2 bg-red-800 text-white rounded-lg"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteContactModal;
