import { useState } from "react"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { formatTime } from "../../../util/time"
import { fetchIncomingDebts, fetchOutgoingDebts } from "../../../redux/debtThunk"
import { IDLE } from "../../../util/config"

const INCOMING = 'INCOMING'
const OUTGOING = 'OUTGOING'

const incomingDebts = []
const outgoingDebts = []

export default function DebtList() {
  const { id } = useSelector((state) => state.user)
  const [activeTab, setActiveTab] = useState(INCOMING)

  // const { incomingDebts, outgoingDebts, status } = useSelector((state) => state.debt)
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   if (status === IDLE) {
  //     dispatch(fetchIncomingDebts());
  //     dispatch(fetchOutgoingDebts());
  //   }
  // }, [dispatch, status]);

  return (
    <div className="mx-auto w-full max-w-4xl">

      <h3 className="text-lg font-semibold">Danh sách khoản nợ</h3>
      <div className="rounded-2xl bg-white p-4">
        <div className="rounded-xl bg-gray-100 p-1 flex items-center gap-1 text-md font-semibold">
          <button
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2  ${activeTab === INCOMING ? `text-red-800 bg-white` : `text-gray-500 hover:text-gray-700`}`}
            onClick={() => setActiveTab(INCOMING)}
          >
            Nhắc nợ phải trả
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 ${activeTab === OUTGOING ? `text-red-800 bg-white` : `text-gray-500 hover:text-gray-700`}`}
            onClick={() => setActiveTab(OUTGOING)}
          >
            Nhắc nợ phải thu
          </button>
        </div>

        <ul role="list" className="divide-y divide-gray-200">
          {activeTab === INCOMING && incomingDebts.map((debt) => (
            <li key={debt.id} className="flex justify-between items-center gap-x-6 py-4 px-1">
              <div className="flex gap-x-4 items-center">
                <img className="size-12 rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <div className="flex flex-col justify-evenly">
                  <p className="text-md font-semibold text-gray-900">Nhắc nợ {id === debt.id_debtor ? `từ ${debt.creditor.fullname}` : `đến ${debt.debtor.fullname}`}</p>
                  <p className="text-md text-gray-500">{formatTime(debt.created_at)}</p>
                </div>
              </div>
              <p className="text-lg text-gray-900 items-end">{debt.debt_amount} VND</p>
            </li>
          ))}

          {activeTab === OUTGOING && outgoingDebts.map((debt) => (
            <li key={debt.id} className="flex justify-between items-center gap-x-6 py-4 px-2 ">
              <div className="flex gap-x-4 items-center">
                <img className="size-12 rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <div className="flex flex-col justify-evenly">
                  <p className="text-md font-semibold text-gray-900">Nhắc nợ {id === debt.id_debtor ? `từ ${debt.creditor.fullname}` : `đến ${debt.debtor.fullname}`}</p>
                  <p className="text-md text-gray-500">{formatTime(debt.created_at)}</p>
                </div>
              </div>
              <div className="flex flex-col items-end justify-evenly">
                <p className="text-lg text-gray-900">{debt.debt_amount} VND</p>
                {debt.status === 'DELETED' && <p className="text-md text-red-800 font-semibold">Đã xóa</p>}
                {debt.status === 'PAID' && <p className="text-md text-green-800 font-semibold">Đã thanh toán</p>}
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
}
