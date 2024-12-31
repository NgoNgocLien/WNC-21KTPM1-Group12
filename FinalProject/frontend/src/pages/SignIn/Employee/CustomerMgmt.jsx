import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers } from '../../../redux/userThunk';
import CustomerTable from '../../../components/Table/CustomerTable';
import AddCustomerModal from '../../../components/CustomerMgmt/AddCustomerModal';
import { PlusIcon } from '@heroicons/react/24/outline'; 

export default function CustomerMgmt() {
  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.user)
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
    <div className="p-6 bg-white rounded-xl shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-800">Quản lý khách hàng</p>
        <button
          onClick={openModal}
          className="py-2 px-4 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Thêm khách hàng mới</span>
        </button>
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
  );
}
