import { useState } from "react"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { formatMoney, formatTime } from "../../../util/format"
import { fetchIncomingDebts, fetchOutgoingDebts } from "../../../redux/debtThunk"
import { IDLE } from "../../../util/config"

const INCOMING = 'INCOMING'
const OUTGOING = 'OUTGOING'

export default function DebtList() {
  const [activeTab, setActiveTab] = useState(INCOMING)

  const { incomingDebts, outgoingDebts, status } = useSelector((state) => state.debt)
  const dispatch = useDispatch()

  useEffect(() => {
    if (status === IDLE) {
      dispatch(fetchIncomingDebts());
      dispatch(fetchOutgoingDebts());
    }
  }, [dispatch, status]);

  return (
    <main className="mx-auto w-full max-w-4xl">
      <h3 className="text-xl font-semibold mb-6">Quản lý nhắc nợ</h3>
      <div className="rounded-2xl bg-white p-6">
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

        {activeTab === INCOMING && (
          <>
            {incomingDebts?.pending.length !== 0 && (
              <>
                <h4 className="text-md font-medium text-gray-500 mt-4">Đang chờ</h4>
                <ul className="divide-y divide-gray-200">
                  {incomingDebts?.pending.map((debt) =>
                    <li key={debt.id} className="flex justify-between items-center gap-x-6 py-4 px-2">
                      <div className="flex gap-x-4 items-center">
                        <img className="size-12 rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                        <div className="flex flex-col justify-evenly">
                          <p className="text-sm text-gray-500">{debt.creditor.fullname}</p>
                          <p className="text-lg text-gray-900 font-semibold">{formatMoney(debt.debt_amount)} VNĐ</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-evenly">
                        <p className="text-sm text-gray-500">{formatTime(debt.created_at)}</p>
                        <p className="text-md text-orange-600 font-semibold">Đang chờ</p>
                      </div>
                    </li>
                  )}
                </ul>
              </>
            )}

            {incomingDebts?.completed.length !== 0 && (
              <>
                <h4 className="text-md font-medium text-gray-500 mt-4">Đã hoàn tất</h4>
                <ul className="divide-y divide-gray-200">
                  {incomingDebts?.completed.map((debt) =>
                    <li key={debt.id} className="flex justify-between items-center gap-x-6 py-4 px-2">
                      <div className="flex gap-x-4 items-center">
                        <img className="size-12 rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                        <div className="flex flex-col justify-evenly">
                          <p className="text-sm text-gray-500">{debt.creditor.fullname}</p>
                          <p className="text-lg text-gray-900 font-semibold">{formatMoney(debt.debt_amount)} VNĐ</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-evenly">
                        <p className="text-sm text-gray-500">{formatTime(debt.created_at)}</p>
                        {debt.status === 'PAID' && <p className="text-md text-green-800 font-semibold">Đã thanh toán</p>}
                        {debt.status === 'DECLINED' && <p className="text-md text-red-800 font-semibold">Đã từ chối</p>}
                        {debt.status === 'CANCELED' && <p className="text-md text-gray-500 font-semibold">Đã hủy</p>}
                      </div>
                    </li>
                  )}
                </ul>
              </>
            )}
          </>
        )}


        {activeTab === OUTGOING && (
          <>
            {outgoingDebts?.pending.length !== 0 && (
              <>
                <h4 className="text-md font-medium text-gray-500 mt-4">Đang chờ</h4>
                <ul className="divide-y divide-gray-200">
                  {outgoingDebts?.pending.map((debt) =>
                    <li key={debt.id} className="flex justify-between items-center gap-x-6 py-4 px-2 ">
                      <div className="flex gap-x-4 items-center">
                        <img className="size-12 rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                        <div className="flex flex-col justify-evenly">
                          <p className="text-sm text-gray-500">{debt.debtor.fullname}</p>
                          <p className="text-lg text-gray-900 font-semibold">{formatMoney(debt.debt_amount)} VNĐ</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-evenly">
                        <p className="text-sm text-gray-500">{formatTime(debt.created_at)}</p>
                        <p className="text-md text-orange-600 font-semibold">Đang chờ</p>
                      </div>
                    </li>
                  )}
                </ul>
              </>
            )}

            {outgoingDebts?.completed.length !== 0 && (
              <>
                <h4 className="text-md font-medium text-gray-500 mt-4">Đã hoàn tất</h4>
                <ul className="divide-y divide-gray-200">
                  {outgoingDebts?.completed.map((debt) =>
                    <li key={debt.id} className="flex justify-between items-center gap-x-6 py-4 px-2 ">
                      <div className="flex gap-x-4 items-center">
                        <img className="size-12 rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                        <div className="flex flex-col justify-evenly">
                          <p className="text-sm text-gray-500">{debt.debtor.fullname}</p>
                          <p className="text-lg text-gray-900 font-semibold">{formatMoney(debt.debt_amount)} VNĐ</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-evenly">
                        <p className="text-sm text-gray-500">{formatTime(debt.created_at)}</p>
                        {debt.status === 'PAID' && <p className="text-md text-green-800 font-semibold">Đã thanh toán</p>}
                        {debt.status === 'DECLINED' && <p className="text-md text-red-800 font-semibold">Đã từ chối</p>}
                        {debt.status === 'CANCELED' && <p className="text-md text-gray-500 font-semibold">Đã hủy</p>}
                      </div>
                    </li>
                  )}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </main>
  )
}
