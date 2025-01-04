import { IoIosClose } from 'react-icons/io'
import { formatMoney } from '../../util/format'
import Avatar from '../Avatar'

export default function DebtDetailModal({ type, debt, isOpen = false, handleClose = () => { } }) {

  console.log(JSON.stringify(debt, null, 2))

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-2xl shadow-xl w-1/3 p-4">

        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Chi tiết nhắc nợ</h3>
          <IoIosClose className="text-gray-500 text-3xl cursor-pointer hover:text-gray-700" onClick={handleClose} />
        </div>
        <div className="m-2">
          <p className="mt-2 text-center text-2xl font-medium">{formatMoney(debt.debt_amount)} VNĐ</p>

          <h4 className="mt-4 text-lg font-medium">Người nhắc nợ</h4>

          <div className="mt-2 flex flex-col gap-y-2">
            <div className="flex justify-between items-center gap-x-6 ">
              <div className="flex gap-x-4 items-center">
                <Avatar size={12} fullname={debt.creditor.fullname} />
                <div className="flex flex-col justify-evenly">
                  <p className="text-lg font-semibold text-gray-900">{debt.creditor.fullname} {type === 'OUTGOING' && '(tôi)'}</p>
                  <p className="text-sm text-gray-500 font-semibold">{debt.creditor.accounts[0].account_number}</p>
                </div>
              </div>
              <div className="flex flex-col items-end justify-evenly">
                {debt.status === 'CANCELED' && <p className="text-md text-gray-500 font-semibold">Đã hủy</p>}
              </div>
            </div>
            <h5 className="mt-2 text-md font-medium">Nội dung nhắc nợ</h5>
            <p className="w-full truncate text-md text-gray-500 bg-gray-100 p-2 rounded-xl flex-1">{(debt.debt_message === '' || debt.debt_message === null || debt.debt_message === undefined) ? '(Không có nội dung)' : debt.debt_message}</p>
            {debt.status === 'CANCELED' && (
              <>
                <h5 className="text-md font-medium">Nội dung hủy</h5>
                <p className="w-full truncate text-md text-gray-500 bg-gray-100 p-2 rounded-xl flex-1">{(debt.debt_deletions.debt_message === '' || debt.debt_deletions.debt_message === null || debt.debt_deletions.debt_message === undefined) ? '(Không có nội dung)' : debt.debt_deletions.debt_message}</p>
              </>
            )}
          </div>

          <h4 className="mt-4 text-lg font-medium">Người nhận lời nhắc</h4>

          <div className="mt-2 flex flex-col gap-y-2">
            <div className="flex justify-between items-center gap-x-6 ">
              <div className="flex gap-x-4 items-center">
                <Avatar size={12} fullname={debt.debtor.fullname} />
                <div className="flex flex-col justify-evenly">
                  <p className="text-lg font-semibold text-gray-900">{debt.debtor.fullname} {type === 'INCOMING' && '(tôi)'}</p>
                  <p className="text-sm text-gray-500 font-semibold">{debt.debtor.accounts[0].account_number}</p>
                </div>
              </div>
              <div className="flex flex-col items-end justify-evenly">
                {debt.status === 'PENDING' && <p className="text-md text-amber-600 font-semibold">Đang chờ</p>}
                {debt.status === 'PAID' && <p className="text-md text-blue-800 font-semibold">Đã thanh toán</p>}
                {debt.status === 'DECLINED' && <p className="text-md text-red-800 font-semibold">Đã từ chối</p>}
              </div>
            </div>
            {debt.status === 'DECLINED' && (
              <>
                <h5 className="mt-2 text-md font-medium">Nội dung từ chối</h5>
                <p className="w-full truncate text-md text-gray-600 bg-gray-100 p-2 rounded-xl flex-1">{(debt.debt_deletions.debt_message === '' || debt.debt_deletions.debt_message === null || debt.debt_deletions.debt_message === undefined) ? '(Không có nội dung)' : debt.debt_deletions.debt_message}</p>
              </>
            )}
            {debt.status === 'PAID' && (
              <>
                <h5 className="mt-2 text-md font-medium">Nội dung thanh toán</h5>
                <p className="w-full truncate text-md text-gray-600 bg-gray-100 p-2 rounded-xl flex-1">{(debt.debt_payments[0].transactions.transactions_message === '' || debt.debt_payments[0].transactions.transactions_message === null || debt.debt_payments[0].transactions.transactions_message === undefined) ? '(Không có nội dung)' : debt.debt_payments[0].transactions.transactions_message}</p>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
