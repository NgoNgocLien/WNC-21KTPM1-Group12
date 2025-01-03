import { FeePayment } from "src/modules/transactions/types/FeePayment.type";

type ExternalTransactionPayload = {
  sender_account_number: string;
  recipient_account_number: string;
  transaction_amount: number | string;
  transaction_message: string;
  fee_payment_method: FeePayment;
  timestamp: number | string;
};

export { ExternalTransactionPayload };
