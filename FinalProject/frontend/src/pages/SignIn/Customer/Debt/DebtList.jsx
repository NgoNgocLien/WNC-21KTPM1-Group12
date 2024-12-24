import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchIncomingDebts, fetchOutgoingDebts } from "../../../../redux/debtThunk"
import { IDLE } from "../../../../util/config"
import DebtItem from "../../../../components/Debt/DebtItem"

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
      <h3 className="text-xl font-semibold mb-6">Danh sách nhắc nợ</h3>
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
                    <DebtItem key={debt.id} debt={debt} type={INCOMING} />
                  )}
                </ul>
              </>
            )}

            {incomingDebts?.completed.length !== 0 && (
              <>
                <h4 className="text-md font-medium text-gray-500 mt-4">Đã hoàn tất</h4>
                <ul className="divide-y divide-gray-200">
                  {incomingDebts?.completed.map((debt) =>
                    <DebtItem key={debt.id} debt={debt} type={INCOMING} />
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
                    <DebtItem key={debt.id} debt={debt} type={OUTGOING} />
                  )}
                </ul>
              </>
            )}

            {outgoingDebts?.completed.length !== 0 && (
              <>
                <h4 className="text-md font-medium text-gray-500 mt-4">Đã hoàn tất</h4>
                <ul className="divide-y divide-gray-200">
                  {outgoingDebts?.completed.map((debt) =>
                    <DebtItem key={debt.id} debt={debt} type={OUTGOING} />
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
