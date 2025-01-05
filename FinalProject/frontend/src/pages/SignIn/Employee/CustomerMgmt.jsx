import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers } from '../../../redux/userThunk';
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from "react-icons/md";
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import CustomerTable from '../../../components/Table/CustomerTable';
import AddCustomerModal from '../../../components/CustomerMgmt/AddCustomerModal';

import TransferHistory from '../../../components/CustomerMgmt/TransferHistory';
import { SUCCEEDED } from '../../../util/config';
import DepositModal from '../../../components/CustomerMgmt/DepositModal';

export default function CustomerMgmt() {
  const dispatch = useDispatch();
  const { customers, status } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortedCustomers, setSortedCustomers] = useState([]);

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (customers) {
      const sortedCustomers = [...customers].sort((a, b) => a.id - b.id);
      setSortedCustomers(sortedCustomers);
    }
  }, [customers]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = () => {
    if (!sortedCustomers) return [];

    const filteredCustomers = sortedCustomers.filter((customer) =>
      customer.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredCustomers;
  };

  const filteredCustomers = handleSearch();
  const customersToDisplay = filteredCustomers.length > 0 ? filteredCustomers : sortedCustomers;

  const totalPages = Math.ceil(customersToDisplay.length / itemsPerPage);
  const currentData = customersToDisplay.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-2 w-full">
      <p className="text-xl font-semibold text-gray-800 mb-2">Quản lý khách hàng</p>

      <div className="flex justify-end mb-5">
        <button
          onClick={openModal}
          className="py-2 px-3 bg-red-800 text-white rounded-lg shadow-lg hover:bg-red-700 focus:outline-none flex items-center space-x-2 transition duration-300 ease-in-out"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="font-normal">Thêm khách hàng</span>
        </button>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-lg space-y-6 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-6 mt-2">
          <div className="relative w-full z-90">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo họ tên"
              className={`w-full p-1.5 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 ${status === SUCCEEDED ? '' : 'bg-gray-200 bg-opacity-5 border-gray-400'}`}
            />
            <button className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={handleSearch}

            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {customers ? (
          <CustomerTable
            customers={currentData}
            openDialog={() => { setIsDepositModalOpen(true) }}
            setSelectedCustomerId={setSelectedCustomerId} />
        ) : (
          <p className="text-gray-600 text-center"></p>
        )}

        <div className="flex justify-center my-4">
          <div className="flex space-x-2 text-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="py-1 px-3 bg-red-800 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300"
            >
              <MdOutlineArrowBackIosNew />
            </button>
            <span className="py-1 px-3 text-gray-700">
              Trang {currentPage} của {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="py-1 px-3 bg-red-800 text-white rounded-lg hover:bg-red-700 
                disabled:bg-gray-300"
            >
              <MdOutlineArrowForwardIos />
            </button>
          </div>
        </div>

      </div>

      <p className="text-xl font-semibold mt-6 mb-6">Lịch sử giao dịch</p>
      <TransferHistory />

      <AddCustomerModal isOpen={isModalOpen} closeModal={closeModal} />

      <DepositModal isOpen={isDepositModalOpen} closeModal={() => { setIsDepositModalOpen(false) }} id_customer={selectedCustomerId} />
    </div>
  );
}
