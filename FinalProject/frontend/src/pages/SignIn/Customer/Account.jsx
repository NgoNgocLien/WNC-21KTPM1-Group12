import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { NavLink, useNavigate } from 'react-router-dom';
import AccountInfo from '../../../components/Account/AccountInfo';
import ContactList from '../../../components/Account/ContactList';
import AddContactModal from '../../../components/Account/Modal/AddContactModal'
import EditContactModal from '../../../components/Account/Modal/EditContactModal'
import DeleteContactModal from '../../../components/Account/Modal/DeleteContactModal'

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
