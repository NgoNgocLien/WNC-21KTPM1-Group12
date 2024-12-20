import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { NavLink, useNavigate } from 'react-router-dom';
import AccountInfo from '../../components/Account/AccountInfo';
import ContactList from '../../components/Account/ContactList';

export default function Account() {
  // const {account_number, balance} = useSelector((state) => state.user)
  return (
    <main className="h-screen ms-64 p-8 flex flex-col gap-4 bg-gray-200">
        <AccountInfo/>
        <ContactList/>
    </main>
  )
}
