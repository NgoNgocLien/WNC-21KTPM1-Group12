import { FeePayment } from "src/modules/transactions/types/FeePayment.type";

type ExternalTransactionResponse = {
  encryptedData: string;
  signature: string;
};

export { ExternalTransactionResponse };
