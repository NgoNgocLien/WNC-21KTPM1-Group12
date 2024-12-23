import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux'
import { updateOneContact } from './../../../redux/userThunk';

const EditContactModal = ({ isOpen, closeModal, contact }) => {
  const dispatch = useDispatch();

  const [nickname, setNickname] = useState('');
  const [currentNickname, setCurrentNickname] = useState('');
  
  useEffect(() => {
    if (contact) {
      setNickname(contact.nickname);
      setCurrentNickname(contact.nickname);
    }
  }, [contact]);

  const handleEdit = () => {
    dispatch(updateOneContact({
      id: contact.id,
      nickname: nickname
    }))
    closeModal();
  }

  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96 flex flex-col items-center">
        <h3 className="text-xl font-semibold">Chỉnh Sửa Người Nhận</h3>

        <div className="w-full my-4">
          <p className=" mb-2">
              Ngân hàng
          </p>
          <div className="flex items-center space-x-4 mb-4">
            <img 
              src="https://via.placeholder.com/150" 
              alt="Bank Logo" 
              className="w-12 h-12 rounded-full "
            />
            <p className="font-semibold">{contact.bank_name.toUpperCase()}</p>
          </div>

          <div className="flex mb-4">
            <div className="w-1/2">
              <p className="">
                Tài khoản thanh toán
              </p>          
              <p className="font-semibold">
                {contact.account_number}
              </p>
            </div>
            <div className="w-1/2">
              <p className="">
                Họ và tên
              </p>          
              <p className="font-semibold">
                {contact.contact_fullname}
              </p>
            </div>
          </div>
        
          <p className="">
              Tên gợi nhớ
          </p>          
          <p className="text-sm text-gray-500 mb-2 italic">Mặc định là tên đăng ký</p>
          <input
            type="text"
            value={nickname}
            onChange={(e) =>  setNickname(e.target.value)}
            className="w-full border-2 p-2 rounded-lg"
          />

        </div>
        
        <div className="flex justify-center mt-4 space-x-4">
          <button 
            onClick={closeModal} 
            className="px-4 py-2 bg-white text-red-800 border-2 border-red-800 rounded-lg hover:bg-red-100">Hủy
          </button>
          <button 
            onClick={handleEdit} 
            disabled={currentNickname === nickname}
            className="px-4 py-2 bg-red-800 text-white rounded-lg disabled:bg-gray-200 disabled:text-gray-400 hover:bg-red-700">Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditContactModal;
