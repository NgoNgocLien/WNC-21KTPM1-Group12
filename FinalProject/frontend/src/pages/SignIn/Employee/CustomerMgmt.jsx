import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers } from '../../../redux/userThunk';
import CustomerTable from '../../../components/Table/CustomerTable';
import AddCustomerModal from '../../../components/CustomerMgmt/AddCustomerModal';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function CustomerMgmt() {
  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const sortedCustomers = customers ? [...customers].sort((a, b) => a.id - b.id) : [];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-2">
      <p className="text-xl font-semibold text-gray-800 mb-2">Quản lý khách hàng</p>
      
      <div className="flex justify-end mb-5">
        <button
          onClick={openModal}
          className="py-2 px-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 focus:outline-none flex items-center space-x-2 transition duration-300 ease-in-out"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="font-normal">Thêm khách hàng</span>
        </button>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-lg space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-6 mt-2">
          <div className="relative w-full ">
            <input
              type="text"
              placeholder="Tìm kiếm theo ..."
              className="w-full p-1.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300 ease-in-out"
            />
            <button className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {customers ? (
          <CustomerTable customers={sortedCustomers} />
        ) : (
          <p className="text-gray-600">Đang tải danh sách khách hàng...</p>
        )}

        {isModalOpen && (
          <AddCustomerModal isOpen={isModalOpen} closeModal={closeModal} />
        )}
      </div>
    </div>
  );
}
