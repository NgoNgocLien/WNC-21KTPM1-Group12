import { IoIosClose } from 'react-icons/io';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelDebt, declineDebt } from '../../redux/debtThunk';

export default function DebtMessageDialog({ isOpen, type, data, handleClose }) {
  const { id_debt, id_deleter } = data
  const dispatch = useDispatch()

  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (type === 'OUTGOING') {
      dispatch(cancelDebt({ id_debt, data: { id_deleter, deletion_message: message } }))
    } else {
      dispatch(declineDebt({ id_debt, data: { id_deleter, deletion_message: message } }))
    }
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-20 bg-gray-800 bg-opacity-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-2xl shadow-xl w-96 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{type === 'OUTGOING' ? "Hủy nhắc nợ" : "Từ chối nợ"}</h3>
          <IoIosClose className="text-gray-500 text-3xl cursor-pointer hover:text-gray-700" onClick={handleClose} />
        </div>
        <h5 className="mt-4 mb-2 text-md font-medium text-gray-500">Nội dung</h5>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl bg-white px-3 py-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-red-800 text-md"
          placeholder={`Nhập nội dung ${type === 'OUTGOING' ? "hủy nhắc nợ" : "từ chối"}`}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="py-2 px-6 bg-red-800 text-white font-semibold rounded-xl hover:bg-red-700"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  )
}
