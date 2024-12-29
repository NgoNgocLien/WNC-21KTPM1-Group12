import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchIncomingDebts, fetchOutgoingDebts } from "../../../../redux/debtThunk"
import { IDLE } from "../../../../util/config"
import DebtItem from "../../../../components/Debt/DebtItem"
import { FaAddressBook } from "react-icons/fa"
import ContactList from "../../../../components/Account/ContactList"
import { fetchUserContacts } from "../../../../redux/userThunk"
import { Field, Formik, Form, ErrorMessage } from "formik"
import * as Yup from 'yup';

const INCOMING = 'INCOMING'
const OUTGOING = 'OUTGOING'

const createDebtSchema = Yup.object().shape({
  account_number: Yup.string().required('Số tài khoản là bắt buộc'),
  amount: Yup.number().required('Số tiền là bắt buộc'),
});

export default function DebtList() {
  const dispatch = useDispatch()

  const [activeTab, setActiveTab] = useState(INCOMING)
  const [displayContacts, setDisplayContacts] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null);

  const { account_number, balance, contacts, fullname } = useSelector((state) => state.user);
  const { incomingDebts, outgoingDebts, status } = useSelector((state) => state.debt)

  useEffect(() => {
    if (status === IDLE) {
      dispatch(fetchIncomingDebts());
      dispatch(fetchOutgoingDebts());
    }
  }, [dispatch, status]);

  const handleClickContactBook = () => {
    if (contacts === null) {
      dispatch(fetchUserContacts());
    }
    setDisplayContacts(true);
  }

  useEffect(() => {
    if (selectedContact) {
      console.log(selectedContact);
    }
  }, [selectedContact]);


  return (
    <>
      {
        displayContacts && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
            <ContactList isMutable={false} setSelectedContact={setSelectedContact} setDisplayContacts={setDisplayContacts} />
          </div>
        )
      }

      <main className="mx-auto w-full max-w-4xl">
        <h3 className="text-xl font-semibold my-4">Tạo nhắc nợ</h3>
        <div className="rounded-2xl bg-white p-6">
          <Formik
            initialValues={{
              account_number: '',
              amount: '',
              message: ''
            }}
            validationSchema={createDebtSchema}
            onSubmit={(values) => console.log(values)}
          >
            <Form className="flex flex-col gap-4">
              <div className="w-full flex justify-between items-center">
                <label htmlFor="account_number" className="w-3/12 font-medium text-gray-900">
                  Đến số tài khoản
                </label>
                <div className="w-7/12 flex items-center rounded-xl outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-red-800">
                  <Field
                    id="account_number"
                    name="account_number"
                    value={selectedContact?.account_number || ''}
                    type="text"
                    required
                    placeholder="Nhập số tài khoản"
                    className="w-full flex-1 bg-white px-3 py-3 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 text-md"
                  />
                  <FaAddressBook className="focus-within:relative pr-3 size-8 text-gray-400 cursor-pointer hover:text-red-800" onClick={handleClickContactBook} />
                </div>
              </div>
              <ErrorMessage name="account_number" component="div" className="text-red-800 text-end" />
              <div className="w-full flex justify-between items-center">
                <label htmlFor="amount" className="w-3/12 font-medium text-gray-900">
                  Số tiền
                </label>
                <div className="w-7/12 flex items-center rounded-xl outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-red-800">
                  <Field
                    id="amount"
                    name="amount"
                    type="number"
                    required
                    placeholder="Nhập số tiền"
                    className="w-full flex-1 bg-white px-3 py-3 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 text-md"
                  />
                  <label for="amount" class="focus-within:relative pr-3 text-md text-gray-400">VNĐ</label>
                </div>
              </div>
              <ErrorMessage name="amount" component="div" className="text-red-800 text-end" />
              <div className="w-full flex justify-between items-center">
                <label htmlFor="message" className="w-3/12 font-medium text-gray-900">
                  Nội dung nhắc nợ
                </label>
                <div className="w-7/12">
                  <Field
                    id="message"
                    name="message"
                    type="text"
                    placeholder="Nhập nội dung nhắc nợ"
                    className="w-full rounded-xl bg-white px-3 py-3 rounded-xl text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-red-800 text-md"
                  />
                </div>
              </div>
              <div className="w-full border-b border-gray-200 my-1"></div>
              <button className="bg-red-800 text-white font-semibold rounded-xl py-2 px-4 self-end">
                Tạo
              </button>
            </Form>
          </Formik>
        </div>

        <h3 className="text-xl font-semibold my-4">Danh sách nhắc nợ</h3>
        <div className="rounded-2xl bg-white p-6">
          <div className="rounded-xl bg-gray-100 p-1 flex items-center gap-1 text-md font-semibold">
            <button
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2  ${activeTab === INCOMING ? `text-red-800 bg-white` : `text-gray-500 hover:text-gray-700`}`}
              onClick={() => setActiveTab(INCOMING)}
            >
              Nhắc nợ phải trả
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2 ${activeTab === OUTGOING ? `text-red-800 bg-white` : `text-gray-500 hover:text-gray-700`}`}
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

    </>
  )
}
