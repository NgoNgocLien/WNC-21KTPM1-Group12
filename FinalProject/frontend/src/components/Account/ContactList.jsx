import React, {useState} from 'react';
import { useSelector } from 'react-redux';

export default function ContactList() {
  const {contacts} = useSelector((state) => state.user)

  const [activeTab, setActiveTab] = useState('internal');


  return (
    <>
    <div className="flex justify-between">
        <p className="text-lg font-semibold">Danh sách người nhận</p>
        <button className="w-fit py-2 px-4 bg-red-800 text-white font-semibold rounded-lg ">
           + Thêm mới
        </button>
    </div>
        
    <div className="p-4 bg-white rounded-lg ">
        <div className="flex space-x-4 p-[2px] bg-gray-200 rounded-lg">
            <button
                className={`w-1/2 py-2 px-4 rounded-lg font-semibold text-gray-500 ${activeTab === 'internal' ? 'text-red-800 bg-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('internal')}
            >
                Nội bộ
            </button>
            <button
                className={`w-1/2 py-2 px-4 rounded-lg font-semibold text-gray-500 ${activeTab === 'external' ? 'text-red-800 bg-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('external')}
            >
                Liên ngân hàng
            </button>
        </div>
    </div>

    <div className="mt-4">
        {contacts.filter(contact => contact.type === 'internal').map((contact, index) => (
        <li key={index} className="py-2">{contact.name}</li>
        ))}
    </div>

    </>
  )
}
