import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { NavLink, useNavigate } from 'react-router-dom';
import AccountInfo from '../../../components/Account/AccountInfo';
import ContactList from '../../../components/Account/ContactList';
import AddContactModal from '../../../components/Account/Modal/AddContactModal'
import EditContactModal from '../../../components/Account/Modal/EditContactModal'
import DeleteContactModal from '../../../components/Account/Modal/DeleteContactModal'
import Dialog from '../../../components/Dialog';

export default function Account() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const openAddModal = () => setIsAddModalOpen(true);
  const openEditModal = (contact) => {
      setSelectedContact(contact);
      setIsEditModalOpen(true);
  };
  const openDeleteModal = (contact) => {
      setSelectedContact(contact);
      setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setIsDeleteModalOpen(false);
      setSelectedContact(null);
  };

  return (
    <>
      <AccountInfo />
      
      <button className="w-fit px-4 py-2 bg-red-800 text-white rounded-xl hover:bg-red-700">
        Đổi mật khẩu
      </button>

      <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">Danh sách người nhận</p>
          <button 
              onClick={openAddModal}
              className="w-fit py-2 px-4 bg-red-800 text-white font-semibold rounded-xl hover:bg-red-700">
          + Thêm mới
          </button>
      </div>

      <ContactList 
        isMutable={true} 
        openAddModal={openAddModal}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
      />
      <AddContactModal 
        isOpen={isAddModalOpen} 
        closeModal={closeModals} 
      />
      <EditContactModal 
          isOpen={isEditModalOpen} 
          closeModal={closeModals} 
          contact={selectedContact} 
      />
      <DeleteContactModal
          isOpen={isDeleteModalOpen}
          closeModal={closeModals}
          contact={selectedContact}
      />
    </>
  )
}
