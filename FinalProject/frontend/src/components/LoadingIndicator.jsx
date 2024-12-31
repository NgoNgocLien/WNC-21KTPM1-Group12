import React, { useState, useEffect } from 'react';
import { LOADING } from '../util/config';
import { useSelector } from 'react-redux';
// import loading from './../../public/'

const LoadingIndicator = () => {
  const [loading, setLoading] = useState(false);
  const { status: userStatus } = useSelector((state) => state.user)
  const { status: authStatus } = useSelector((state) => state.auth)
  const { status: transactionStatus } = useSelector((state) => state.transaction)
  const { status: debtStatus } = useSelector((state) => state.debt)

  useEffect(() => {
    if (userStatus === LOADING || authStatus === LOADING || transactionStatus === LOADING || debtStatus === LOADING) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [userStatus, authStatus, transactionStatus, debtStatus])

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-30 z-50">
      <img src={`${process.env.PUBLIC_URL}/loading-gif.gif`} className="w-16"></img>
    </div>
  );
};

export default LoadingIndicator;
