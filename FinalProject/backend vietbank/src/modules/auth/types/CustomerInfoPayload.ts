import { FeePayment } from "src/modules/transactions/types/FeePayment.type";

type CustomerInfoPayload = {
  bank_code: string;
  account_number: string;
  timestamp: number | string;
};

export { CustomerInfoPayload };
