import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons

const BalanceDisplay = ({ balance }) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  return (
    <div className="flex items-center space-x-2">
        <span className="">
          {isBalanceVisible ? (
            <span>{balance} VNĐ</span> // Show balance when visible
          ) : (
            <span className="">••••••</span> // Hidden by default
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
