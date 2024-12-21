import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from './../redux/authSlice'
import { reset } from './../redux/userSlice'
import { fetchUserAccountInfo } from './../redux/userThunk';
import { IDLE, LOADING, FAILED } from './../util/config'

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { account_number, fullname, status, error } = useSelector((state) => state.user);
  
    useEffect(() => {
        if (status === IDLE) {
            dispatch(fetchUserAccountInfo());
        }
    }, [status, dispatch]);
  
    // if (status === LOADING) return <p>Loading...</p>;
    // if (status === FAILED) return <p className="text-red-500">Error: {error}</p>;

    const handleLogout = () => {
        dispatch(logout()); 
        dispatch(reset()); 
        navigate("/home")
    };
    return (
        <div className="fixed h-screen w-64 p-1">
            <div className="h-full w-64 bg-red-800 text-white font-semibold flex flex-col justify-between rounded-xl">
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
                        to="/transfer" 
                        className="block bg-white my-4 py-3 px-4 rounded transition duration-200"
                    >
                        Chuyển tiền
                    </NavLink>
                    <NavLink 
                        to="/debt" 
                        className="block bg-white my-4 py-3 px-4 rounded transition duration-200"
                    >
                        Quản lí nhắc nợ
                    </NavLink>
                    <NavLink 
                        to="/account" 
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
        </div>
    );
};

export default Sidebar;
