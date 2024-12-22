import TransferTab from "../../../components/Transfer/TransferTab";
import TransferHistory from "../../../components/Transfer/TransferHistory";

export default function Transfer() {
  return (
    <main className="ms-80 p-8 flex flex-col gap-4 bg-red-50 overflow-auto">
      <TransferTab />
      <TransferHistory />
    </main>
  )
}
