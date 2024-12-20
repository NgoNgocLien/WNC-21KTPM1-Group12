import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from './../stores/authSlide'
import { reset } from './../stores/userSlide'
const Sidebar = () => {
    const { fullname, account_number } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout()); 
        dispatch(reset()); 
        navigate("/home")
    };
    return (
        <div className="fixed h-screen w-64 bg-red-800 text-white font-semibold flex flex-col justify-between">
            <div>
                <div className="p-4 text-center">
                    <div className="p-4 bg-red-900 rounded-md">
                        <div className="flex items-center justify-center p-4">
                            <img 
                                src="https://via.placeholder.com/150" 
                                alt="Avatar" 
                                className="w-24 h-24 rounded-full border-2 border-white"
                            />
                        </div>
                        <p className="text-xl">{fullname}</p>
                        <p className="text-slate-300">STK: {account_number}</p>
                    </div>
                </div>
                <nav className="mt-8 w-5/6 mx-auto text-black">
                    <NavLink 
                        to="/dashboard" 
                        className="block bg-white my-4 py-3 px-4 rounded transition duration-200"
                    >
                        Chuyển tiền
                    </NavLink>
                    <NavLink 
                        to="/profile" 
                        className="block bg-white my-4 py-3 px-4 rounded transition duration-200"
                    >
                        Quản lí nhắc nợ
                    </NavLink>
                    <NavLink 
                        to="/settings" 
                        className="block bg-white my-4 py-3 px-4 rounded transition duration-200"
                    >
                        Tài khoản
                    </NavLink>
                </nav>
            </div>
            <nav className="mb-4 w-fit mx-auto">
                <NavLink 
                    onClick={handleLogout}
                    className="block py-2 px-4 border-2 rounded-lg transition duration-200"
                >
                    Đăng xuất
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
