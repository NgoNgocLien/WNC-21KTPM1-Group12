import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { fetchCustomers } from '../../../redux/userThunk';
import CustomerTable from '../../../components/Table/CustomerTable';
import AddCustomerModal from '../../../components/CustomerMgmt/AddCustomerModal';

export default function CustomerMgmt() {
  const dispatch = useDispatch();
  //const customers = useSelector((state) => state.user.customers);
  const customers = [];
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   dispatch(fetchCustomers());
  // }, [dispatch]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-800">Quản lý khách hàng</p>
        <button
          onClick={openModal}
          className="py-2 px-4 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span>Thêm khách hàng mới</span>
        </button>
      </div>

      <CustomerTable customers={customers} />

      {isModalOpen && (
        <AddCustomerModal isOpen={isModalOpen} closeModal={closeModal} />
      )}
    </div>
  );
}
