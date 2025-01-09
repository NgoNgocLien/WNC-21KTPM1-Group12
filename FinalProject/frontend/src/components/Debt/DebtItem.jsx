import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { formatMoney, formatTime } from '../../util/format'
import DebtDetailModal from './DebtDetailModal'
import Avatar from '../Avatar'
import DebtMessageDialog from './DebtMessageDialog'
import { resetRequiredDebtDetail } from "../../redux/debtSlice"

export default function DebtItem({ debt, type }) {
  const navigate = useNavigate();
  const { id, account_number, fullname, username } = useSelector((state) => state.user)
  const [detailIsOpen, setDetailIsOpen] = useState(false)
  const [messageIsOpen, setMessageIsOpen] = useState(false)
  const [debtDetail, setDebtDetail] = useState(null)

  const openDebtDetail = () => {
    if (type === 'INCOMING') {
      setDebtDetail({
        debtor: {
          id,
          accounts: [{ account_number }],
          fullname,
          username
        },
        ...debt
      })
    } else if (type === 'OUTGOING') {
      setDebtDetail({
        creditor: {
          id,
          accounts: [{ account_number }],
          fullname,
          username
        },
        ...debt
      })
    }
    setDetailIsOpen(true)
  }

  const { requiredDebtDetail } = useSelector((state) => state.debt)
  const dispatch = useDispatch()

  useEffect(() => {
    if (requiredDebtDetail == debt.id) {
      openDebtDetail()
    }
  }, [requiredDebtDetail])

  const closeDebtDetail = () => {
    setDetailIsOpen(false)
    dispatch(resetRequiredDebtDetail())
  }
  const openMessageDialog = () => {
    setMessageIsOpen(true)
  }
  const closeMessageDialog = () => {
    setMessageIsOpen(false)
  }
  const handlePayment = () => {
    navigate("/customer/transfer-internal", {
      state: {
        debt: debt
      }
    })
  }
  return (
    <>
      {detailIsOpen &&
        <DebtDetailModal isOpen={detailIsOpen} handleClose={closeDebtDetail} debt={debtDetail} type={type} />
      }
      {messageIsOpen &&
        <DebtMessageDialog isOpen={messageIsOpen} type={type} handleClose={closeMessageDialog} data={{ id_debt: debt.id, id_deleter: id }} />
      }
      <li className="py-4 flex flex-col gap-y-2">
        <div className="flex justify-between items-center gap-x-6 ">
          <div className="flex gap-x-4 items-center cursor-pointer" onClick={() => openDebtDetail()}>
            <Avatar size={12} fullname={type === 'INCOMING' ? debt.creditor.fullname : debt.debtor.fullname} />
            <div className="flex flex-col justify-evenly">
              {type === 'INCOMING' && <p className="text-sm text-gray-500">{debt.creditor.fullname}</p>}
              {type === 'OUTGOING' && <p className="text-sm text-gray-500">{debt.debtor.fullname}</p>}
              <p className="text-lg text-gray-900 font-semibold">{formatMoney(debt.debt_amount)} VNĐ</p>
            </div>
          </div>
          <div className="flex flex-col items-end justify-evenly cursor-default">
            <p className="text-sm text-gray-500">{formatTime(debt.created_at)}</p>
            {debt.status === 'PENDING' && <p className="text-md text-amber-600 font-semibold">Đang chờ</p>}
            {debt.status === 'PAID' && <p className="text-md text-green-700 font-semibold">Đã thanh toán</p>}
            {debt.status === 'DECLINED' && <p className="text-md text-red-800 font-semibold">Đã từ chối</p>}
            {debt.status === 'CANCELED' && <p className="text-md text-gray-500 font-semibold">Đã hủy</p>}
          </div>
        </div>
        {type === 'INCOMING' && debt.status === 'PENDING' && (
          <div className="flex items-center w-full gap-x-2">
            <p className="truncate text-md text-gray-500 bg-gray-100 p-2 rounded-xl flex-1">{(debt.debt_message === '' || debt.debt_message === null) ? '(Không có nội dung)' : debt.debt_message}</p>
            <button
              onClick={openMessageDialog}
              className="text-sm text-white bg-red-800 hover:bg-red-700 px-3 py-2 rounded-xl font-semibold"
            >
              Từ chối
            </button>
            <button
              onClick={handlePayment}
              className="text-sm text-white bg-blue-700 hover:bg-blue-600 px-3 py-2 rounded-xl font-semibold">
              Thanh toán
            </button>
          </div>
        )}
        {type === 'OUTGOING' && debt.status === 'PENDING' && (
          <div className="flex items-center w-full gap-x-2">
            <p className="truncate text-md text-gray-500 bg-gray-100 p-2 rounded-xl flex-1">{(debt.debt_message === '' || debt.debt_message === null) ? '(Không có nội dung)' : debt.debt_message}</p>
            <button
              onClick={openMessageDialog}
              className="text-sm text-white bg-red-800 hover:bg-red-700 px-3 py-2 rounded-xl font-semibold"
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
