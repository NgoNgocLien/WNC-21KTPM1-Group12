import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUniversity, FaExternalLinkAlt } from 'react-icons/fa';

export default function TransferTab() {
  return (
    <>
        <p className="text-lg font-semibold">Chuyển tiền</p>

        <div className="flex space-x-4 font-semibold">
            <NavLink to="/transfer-internal" className="w-2/12 py-8 bg-white rounded-lg flex flex-col items-center text-center gap-2">
                <FaUniversity size={40} className="text-red-800" />
                Chuyển trong NoMeoBank
            </NavLink>
            <NavLink to="/transfer-external" className="w-2/12 py-8 bg-white rounded-lg flex flex-col items-center text-center gap-2">
                <FaExternalLinkAlt  size={37} className="text-red-800 mb-1"/>
                Chuyển ngoài NoMeoBank
            </NavLink>
        </div>
    </>
  )
}
