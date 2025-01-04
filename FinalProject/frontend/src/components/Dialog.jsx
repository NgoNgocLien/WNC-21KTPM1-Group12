import React, { useState, useEffect } from 'react';
import { IoIosClose } from "react-icons/io";
import { useDispatch, useSelector, } from 'react-redux';

import { openDialog, closeDialog } from '../redux/dialogSlice';
import { resetUserStatus } from '../redux/userSlice'
import { resetAuthStatus } from '../redux/authSlice';
import { resetDebtStatus } from '../redux/debtSlice';
import { resetTransactionStatus } from '../redux/transactionSlice';

import { FAILED } from './../util/config';

const Dialog = () => {
  const dispatch = useDispatch();
  const { isOpen, type, message, actionBtn} = useSelector((state) => state.dialog);
  const { status: userStatus, error: userError } = useSelector((state) => state.user)
  const { status: authStatus, error: authError } = useSelector((state) => state.auth)
  const { status: transactionStatus, error: transactionError } = useSelector((state) => state.transaction)
  const { status: debtStatus, error: debtError } = useSelector((state) => state.debt)
  const [config, setConfig] = useState({})

  useEffect(() => {
    if (userStatus === FAILED || authStatus === FAILED || transactionStatus === FAILED || debtStatus === FAILED) {
      dispatch(openDialog({
        type: "error",
        message: userError || authError || transactionError || debtError,
        actionBtn: false,
      }));
    }
  }, [userStatus, authStatus, transactionStatus, debtError])

  useEffect(() => {
    switch (type) {
      case 'error':
        setConfig({
          title: "Lỗi"
        });
        break;
      case 'confirm':
        setConfig({
          title: "Xác nhận"
        });
        break;
      case 'info':
        setConfig({
          title: "Thông tin"
        });
        break;
      default:
    }
  }, [type])

  const handleCloseBtn = () => {
    dispatch(closeDialog());
    dispatch(resetUserStatus());
    dispatch(resetAuthStatus());
    dispatch(resetTransactionStatus());
    dispatch(resetDebtStatus());
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className={`bg-white rounded-xl shadow-xl w-96`}>

        <div className="p-4">
          <div className="flex justify-between items-center">
            <h3 className={`text-xl font-semibold`}>{config?.title}</h3>
            <IoIosClose className="text-gray-500 text-3xl cursor-pointer hover:text-gray-700" onClick={handleCloseBtn} />
          </div>
          <p className={`mt-2`}>{message?.replace(/^'|'$/g, '')}</p>
        </div>

        <div className="flex justify-center p-4">
          {
            actionBtn ? (
              <>
                <button
                  onClick={handleCloseBtn}
                  className={`px-4 py-2 bg-white text-red-800 border-2 border-red-800 rounded-xl hover:bg-red-100`}
                >
                  Đóng
                </button>
                <button
                  onClick={handleCloseBtn}
                  className={`px-4 py-2 bg-red-800 text-white rounded-xl hover:bg-red-700`}
                >
                  {actionBtn}
                </button>
              </>
            ) : (
              <button
                onClick={handleCloseBtn}
                className={`px-4 py-2 bg-red-800 text-white rounded-xl hover:bg-red-700`}
              >
                Đóng
              </button>
            )
          }

        </div>
      </div>
    </div>
  );
};

export default Dialog;
