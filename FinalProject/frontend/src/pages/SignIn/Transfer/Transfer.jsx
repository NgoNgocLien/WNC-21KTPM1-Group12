import TransferTab from "../../../components/Transfer/TransferTab";
import TransferHistory from "../../../components/Transfer/TransferHistory";

export default function Transfer() {
  return (
    <main className="ms-64 p-8 flex flex-col gap-4 bg-gray-200 overflow-auto">
      <TransferTab/>
      <TransferHistory/>
    </main>
  )
}
