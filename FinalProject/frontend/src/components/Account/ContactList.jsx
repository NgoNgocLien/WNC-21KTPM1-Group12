import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrash, FaPen  } from 'react-icons/fa';
import { IoIosClose } from "react-icons/io";

import { getCustomerContacts } from './../../redux/userThunk';
import { IDLE, LOADING, FAILED, INTERNAL, EXTERNAL } from './../../util/config';

export default function ContactList({
    isMutable,
    isInternal = true,
    openEditModal,
    openDeleteModal,
    setSelectedContact,
    setDisplayContacts
}) {
    const dispatch = useDispatch();
    const {contacts, status, error} = useSelector((state) => state.user)

    useEffect(() => {
        if (contacts === null) {
            dispatch(getCustomerContacts());
        }
    }, [status, dispatch]);

    const [activeTab, setActiveTab] = useState(isInternal ? INTERNAL : EXTERNAL);
    const [filterContacts, setFilterContacts] = useState([]);
  
    useEffect(() => {
      const newContacts = contacts?.filter(
        contact => (activeTab === INTERNAL && contact?.bank_name === 'NoMeoBank') || (activeTab === EXTERNAL && contact?.bank_name !== 'NoMeoBank')
      );
      setFilterContacts(newContacts);
    }, [contacts, activeTab]);

    const handleClickContact = (contact) => {
        if (!isMutable){
            setSelectedContact(contact)
            setDisplayContacts(false)
        }
    }
    return (
    <>
       
    <div className="flex flex-col p-4 bg-white rounded-xl ">
        {
            isMutable ? (
            <div className="flex space-x-4 p-[2px] bg-gray-200 rounded-xl">
                <button
                    className={`w-1/2 py-2 px-4 rounded-xl font-semibold text-gray-500 ${activeTab === INTERNAL ? 'text-red-800 bg-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab(INTERNAL)}
                >
                    Nội bộ
                </button>
                <button
                    className={`w-1/2 py-2 px-4 rounded-xl font-semibold text-gray-500 ${activeTab === EXTERNAL ? 'text-red-800 bg-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab(EXTERNAL)}
                >
                    Liên ngân hàng
                </button>
            </div>
            ) : (
                <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">Danh sách người nhận</p>
                <IoIosClose className="text-gray-500 text-3xl cursor-pointer hover:text-gray-700" onClick={() => setDisplayContacts(false)}/>
                </div>
            )
        }
        
        <div className="mt-4 px-8 max-h-[300px] min-h-[300px] overflow-y-auto">
        <div className="w-full flex flex-col justify-center gap-4 mt-2 items-start"> 
        {
            filterContacts?.length === 0 
            ?
                (
                    <div className="w-full flex flex-col justify-center items-center space-y-2 ">
                        <img src={`${process.env.PUBLIC_URL}/status/not-found.png`} className="w-2/12 m-0"></img>
                        <p className="m-0">Chưa có người nhận</p>
                    </div>
                )
            :
                
                filterContacts?.map((contact) => (
                    <div 
                        onClick={() => handleClickContact(contact)}
                        key={`${contact?.id}`} 
                        className={`w-full flex justify-between items-center pb-3 pt-0 border-b border-gray-300
                            ${!isMutable && 'cursor-pointer'}`}>
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
                        {
                            isMutable && (
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
                            )
                        }
                        
                    </div>
                ))
            }
        </div>
            
        </div>
        {
            !isMutable && (
                <button 
                    onClick={() => setDisplayContacts(false)}
                    className="w-fit mt-4 py-2 px-4 self-center bg-red-800 text-white font-semibold rounded-xl hover:bg-red-700">
                    Đóng
                </button>
            )
        }
    </div>   
    </>
  )
}
