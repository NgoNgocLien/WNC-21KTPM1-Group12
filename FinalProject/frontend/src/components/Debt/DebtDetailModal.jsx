import { IoIosClose } from 'react-icons/io'
import { formatMoney } from '../../util/format'

export default function DebtDetailModal({ type, debt, isOpen = false, handleCloseDebtDetail = () => { } }) {

  console.log(debt)

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-xl shadow-xl w-1/3">

        <div className="p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Chi tiết nhắc nợ</h3>
            <IoIosClose className="text-gray-500 text-3xl cursor-pointer hover:text-gray-700" onClick={handleCloseDebtDetail} />
          </div>
          <p className="mt-2 text-center text-2xl font-medium">{formatMoney(debt.debt_amount)} VNĐ</p>

          <h4 className="mt-4 text-lg font-medium">Người nhắc nợ</h4>

          {type === 'INCOMING' && (<>
            <p>{debt.creditor.fullname} (tôi)</p>
            <p>{debt.creditor.accounts[0].account_number}</p>
          </>
          )}

          <h4 className="mt-4 text-lg font-medium">Người nhận lời nhắc</h4>
          <p>{debt.debtor.fullname}</p>
          <p>{debt.debtor.accounts[0].account_number}</p>

        </div>

      </div>
    </div>
  )
}
