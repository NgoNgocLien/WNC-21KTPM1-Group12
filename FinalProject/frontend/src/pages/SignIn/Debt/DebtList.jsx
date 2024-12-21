import { useState } from "react"

const INCOMING = 'incoming'
const OUTGOING = 'outgoing'

const data = [
  {
    "id": 2,
    "id_creditor": 2,
    "id_debtor": 1,
    "debt_amount": "50",
    "debt_message": "Debt for services rendered",
    "status": "PENDING",
    "created_at": "2024-12-12T10:00:00.000Z",
    "creditor": {
      "id": 2,
      "username": "jane_smith",
      "fullname": "Jane Smith"
    }
  },
  {
    "id": 4,
    "id_creditor": 2,
    "id_debtor": 1,
    "debt_amount": "15000",
    "debt_message": "Test",
    "status": "PENDING",
    "created_at": "2024-12-14T19:00:00.000Z",
    "creditor": {
      "id": 2,
      "username": "jane_smith",
      "fullname": "Jane Smith"
    }
  }
]

export default function DebtList() {
  const [activeTab, setActiveTab] = useState(INCOMING)

  return (
    <main className="flex flex-col justify-center ms-64 h-full">
      <div className="mx-auto w-full max-w-4xl">

        <h3 className="text-lg font-semibold">Danh sách khoản nợ</h3>
        <div className="rounded-2xl bg-white p-4">
          <div className="rounded-xl bg-gray-100 p-1 flex items-center gap-1 text-md font-semibold">
            <button
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 hover:text-red-800 ${activeTab === INCOMING ? `text-red-800  bg-white` : `text-gray-500`}`}
              onClick={() => setActiveTab(INCOMING)}
            >
              Khoản nợ cần trả
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 hover:text-red-800 ${activeTab === OUTGOING ? `text-red-800  bg-white` : `text-gray-500`}`}
              onClick={() => setActiveTab(OUTGOING)}
            >
              Khoản nợ đang chờ
            </button>
          </div>

          <div className="mt-4 px-8 flex flex-col justify-center space-y-4">

          </div>

        </div>
      </div>
    </main >
  )
}
