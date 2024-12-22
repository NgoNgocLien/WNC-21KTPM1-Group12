import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { NavLink, useNavigate } from 'react-router-dom';
import AccountInfo from '../../components/Account/AccountInfo';
import ContactList from '../../components/Account/ContactList';

export default function Account() {
  return (
    <main className="ms-64 p-8 flex flex-col gap-4 bg-red-50 overflow-auto">
      <AccountInfo />
      <ContactList />
    </main>
  )
}
