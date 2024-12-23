import TransferTab from "../../../../components/Transfer/TransferTab";
import TransferHistory from "../../../../components/Transfer/TransferHistory";

export default function Transfer() {
  return (
    <div className="mx-auto w-full max-w-4xl flex flex-col gap-4">
      <TransferTab/>
      <p className="text-lg font-semibold">Lịch sử giao dịch</p>
      <TransferHistory/>
    </div>
  )
}
