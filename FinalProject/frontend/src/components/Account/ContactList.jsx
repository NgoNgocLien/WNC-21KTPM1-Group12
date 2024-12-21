import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrash, FaPen  } from 'react-icons/fa';

import AddContactModal from './Modal/AddContactModal'
import EditContactModal from './Modal/EditContactModal'
import DeleteContactModal from './Modal/DeleteContactModal'

import { fetchUserContacts } from './../../redux/userThunk';
import { IDLE, LOADING, FAILED } from './../../util/config';

const INTERNAL = 'internal'
const EXTERNAL = 'external'

export default function ContactList() {
    const dispatch = useDispatch();
    const {contacts, status, error} = useSelector((state) => state.user)

    useEffect(() => {
        if (status === IDLE) {
            dispatch(fetchUserContacts());
        }
    }, [status, dispatch]);

    const [activeTab, setActiveTab] = useState(INTERNAL);
    const [filterContacts, setFilterContacts] = useState([]);
  
    useEffect(() => {
      const newContacts = contacts.filter(
        contact => (activeTab === INTERNAL && contact?.bank_name === 'NoMeoBank') || (activeTab === EXTERNAL && contact?.bank_name !== 'NoMeoBank')
      );
      setFilterContacts(newContacts);
    }, [contacts, activeTab]);

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
    <div className="flex justify-between">
        <p className="text-lg font-semibold">Danh sách người nhận</p>
        <button 
            onClick={openAddModal}
            className="w-fit py-2 px-4 bg-red-800 text-white font-semibold rounded-lg ">
           + Thêm mới
        </button>
    </div>
        
    <div className="p-4 bg-white rounded-lg ">
        <div className="flex space-x-4 p-[2px] bg-gray-200 rounded-lg">
            <button
                className={`w-1/2 py-2 px-4 rounded-lg font-semibold text-gray-500 ${activeTab === INTERNAL ? 'text-red-800 bg-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab(INTERNAL)}
            >
                Nội bộ
            </button>
            <button
                className={`w-1/2 py-2 px-4 rounded-lg font-semibold text-gray-500 ${activeTab === EXTERNAL ? 'text-red-800 bg-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab(EXTERNAL)}
            >
                Liên ngân hàng
            </button>
        </div>
        <div className="mt-4 px-8 flex flex-col justify-center space-y-4 max-h-[300px] min-h-[300px] overflow-y-auto">
            {
            filterContacts.length === 0 
            ?
                <p className="self-center">Chưa có người nhận</p>
            :
                
                filterContacts.map((contact) => (
                    <div key={`${contact?.id}`} className="flex justify-between items-center mt-2">
                        <div className="flex space-x-3">
                            <img 
                                src={contact?.bank_logo || "https://via.placeholder.com/150" } 
                                alt="Bank Logo" 
                                className="w-12 h-12 rounded-full "
                            />
                            <div className="flex flex-col ">
                                <p className="font-semibold">
                                    {contact?.nickname}
                                </p>
                                <p className="text-gray-500">
                                    {contact?.bank_name} - {contact?.contact_fullname?.toUpperCase()}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button 
                                onClick={() => openEditModal(contact)}
                                className="h-fit p-2 text-red-800 border-[1px] border-red-800 rounded-full hover:bg-red-100 transition">
                                <FaPen size={12} />
                            </button>

                            <button 
                                onClick={() => openDeleteModal(contact)}
                                className="h-fit p-2 text-red-800 border-[1px] border-red-800 rounded-full hover:bg-red-100 transition">
                                <FaTrash size={12} />
                            </button>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>

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
