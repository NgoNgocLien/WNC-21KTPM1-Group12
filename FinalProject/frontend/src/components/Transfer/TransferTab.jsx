import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUniversity, FaExternalLinkAlt } from 'react-icons/fa';

export default function TransferTab() {
  return (
    <>
      <p className="text-lg font-semibold">Chuyển tiền</p>

      <div className="flex space-x-4 font-semibold">
        <NavLink to="/customer/transfer-internal" className="w-1/5 py-8 bg-white rounded-2xl flex flex-col items-center text-center gap-2 hover:text-red-800">
          <FaUniversity size={40} className="text-red-800" />
          Chuyển trong NoMeoBank
        </NavLink>
        <NavLink to="/customer/transfer-external" className="w-1/5 py-8 bg-white rounded-2xl flex flex-col items-center text-center gap-2 hover:text-red-800">
          <FaExternalLinkAlt size={37} className="text-red-800 mb-1" />
          Chuyển ngoài NoMeoBank
        </NavLink>
      </div>
    </>
  )
}
