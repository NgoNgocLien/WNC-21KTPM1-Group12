import { useSelector, useDispatch } from 'react-redux'
import { formatMoney, formatTime } from '../../util/format'
import { cancelDebt, declineDebt } from '../../redux/debtThunk'
import DebtDetailModal from './DebtDetailModal'
import { useState } from 'react'

export default function DebtItem({ debt, type }) {
  const { id, account_number, fullname, username } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleDeclineDebt = async (id_debt) => {
    dispatch(declineDebt({ id_debt, data: { id_deleter: id, deletion_message: 'Từ chối nhắc nợ' } }))
  }

  const handleCancelDebt = async (id_debt) => {
    dispatch(cancelDebt({ id_debt, data: { id_deleter: id, deletion_message: 'Hủy nhắc nợ' } }))
  }

  const [isOpen, setIsOpen] = useState(false)
  const [debtDetail, setDebtDetail] = useState(null)
  const openDebtDetail = () => {
    if (type === 'INCOMING') {
      setDebtDetail({
        debtor: {
          id,
          accounts: [account_number],
          fullname,
          username
        },
        ...debt
      })
    } else {
      setDebtDetail({
        creditor: {
          id,
          account_number: [{ account_number }],
          fullname,
          username
        },
        ...debt
      })
    }
    console.log(debtDetail)
    setIsOpen(true)

  }
  const handleCloseDebtDetail = () => {
    setIsOpen(false)
  }

  return (
    <>
      {isOpen &&
        <DebtDetailModal isOpen={isOpen} handleCloseDebtDetail={handleCloseDebtDetail} debt={debtDetail} type={type} />
      }
      <li className="py-4 flex flex-col gap-y-2">
        <div className="flex justify-between items-center gap-x-6 ">
          <div className="flex gap-x-4 items-center cursor-pointer" onClick={() => openDebtDetail()}>
            <img className="size-12 rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
            <div className="flex flex-col justify-evenly">
              {type === 'INCOMING' && <p className="text-sm text-gray-500">{debt.creditor.fullname}</p>}
              {type === 'OUTGOING' && <p className="text-sm text-gray-500">{debt.debtor.fullname}</p>}
              <p className="text-lg text-gray-900 font-semibold">{formatMoney(debt.debt_amount)} VNĐ</p>
            </div>
          </div>
          <div className="flex flex-col items-end justify-evenly cursor-default">
            <p className="text-sm text-gray-500">{formatTime(debt.created_at)}</p>
            {debt.status === 'PENDING' && <p className="text-md text-amber-600 font-semibold">Đang chờ</p>}
            {debt.status === 'PAID' && <p className="text-md text-green-800 font-semibold">Đã thanh toán</p>}
            {debt.status === 'DECLINED' && <p className="text-md text-red-800 font-semibold">Đã từ chối</p>}
            {debt.status === 'CANCELED' && <p className="text-md text-gray-500 font-semibold">Đã hủy</p>}
          </div>
        </div>
        {type === 'INCOMING' && debt.status === 'PENDING' && (
          <div className="flex items-center w-full gap-x-2">
            <p className="truncate text-md text-gray-500 bg-gray-100 p-2 rounded-xl flex-1">{(debt.debt_message === '' || debt.debt_message === null) ? '(Không có nội dung)' : debt.debt_message}</p>
            <button
              onClick={() => handleDeclineDebt(debt.id)}
              className="text-sm text-white bg-red-700 px-3 py-2 rounded-xl font-semibold"
            >
              Từ chối
            </button>
            <button className="text-sm text-white bg-blue-700 px-3 py-2 rounded-xl font-semibold">Thanh toán</button>
          </div>
        )}
        {type === 'OUTGOING' && debt.status === 'PENDING' && (
          <div className="flex items-center w-full gap-x-2">
            <p className="truncate text-md text-gray-500 bg-gray-100 p-2 rounded-xl flex-1">{(debt.debt_message === '' || debt.debt_message === null) ? '(Không có nội dung)' : debt.debt_message}</p>
            <button
              onClick={() => handleCancelDebt(debt.id)}
              className="text-sm text-white bg-red-700 px-3 py-2 rounded-xl font-semibold"
            >
              Hủy nhắc nợ
            </button>
          </div>
        )}
        {debt.status !== 'PENDING' && (
          <p className="w-full truncate text-md text-gray-600 bg-gray-100 p-2 rounded-xl flex-1">{(debt.debt_message === '' || debt.debt_message === null) ? '(Không có nội dung)' : debt.debt_message}</p>
        )}
      </li>
    </>
  )
}
