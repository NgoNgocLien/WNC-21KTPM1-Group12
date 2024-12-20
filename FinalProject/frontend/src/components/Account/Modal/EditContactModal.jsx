import React, {useState, useEffect} from 'react';

const EditContactModal = ({ isOpen, closeModal, contact }) => {
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (contact) {
      setNickname(contact.nickname);
    }
  }, [contact]);

  if (!isOpen || !contact) return null;

  

  const handleEdit = () => {

  }

  console.log(contact)
  console.log(nickname)

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96 flex flex-col items-center">
        <h3 className="text-xl font-semibold">Chỉnh Sửa Người Nhận</h3>

        <div className="w-full my-4">
          <p className="text-gray-500 mb-2">
              Ngân hàng
          </p>
          <div className="flex items-center space-x-4 mb-4">
            <img 
              src="https://via.placeholder.com/150" 
              alt="Bank Logo" 
              className="w-12 h-12 rounded-full "
            />
            <p>{contact.bank_name.toUpperCase()}</p>
          </div>

          <div className="flex mb-4">
            <div className="w-1/2">
              <p className="text-gray-500">
                Tài khoản thanh toán
              </p>          
              <p>
                {contact.account_number}
              </p>
            </div>
            <div className="w-1/2">
              <p className="text-gray-500">
                Họ và tên
              </p>          
              <p>
                {contact.fullname}
              </p>
            </div>
          </div>
        
          <p className="text-gray-500 mb-2">
              Tên gợi nhớ
          </p>          
          <input
            type="text"
            value={nickname}
            onChange={(e) =>  setNickname(e.target.value)}
            className="w-full border-2 p-2 rounded-lg"
          />

        </div>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={closeModal} 
            className="mt-4 px-4 py-2 bg-gray-200 rounded-lg">Hủy
          </button>
          <button 
            onClick={handleEdit} 
            className="mt-4 px-4 py-2 bg-red-800 text-white rounded-lg">Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditContactModal;
