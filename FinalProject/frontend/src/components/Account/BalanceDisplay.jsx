import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons

const BalanceDisplay = ({ balance }) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  // Format the balance with commas as delimiter
  const formattedBalance = Number(balance).toLocaleString();

  return (
    <div className="flex items-center space-x-2">
      <span className="">
        {isBalanceVisible ? (
          <span>{formattedBalance} VNĐ</span> // Show balance when visible with comma delimiter
        ) : (
          <span>•••••• VNĐ</span> // Hidden by default
        )}
      </span>
      <button 
        onClick={toggleBalanceVisibility} 
        className="text-xl text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        {isBalanceVisible ? <FaEyeSlash /> : <FaEye />} {/* Toggle eye icon */}
      </button>
    </div>
  );
};

export default BalanceDisplay;
