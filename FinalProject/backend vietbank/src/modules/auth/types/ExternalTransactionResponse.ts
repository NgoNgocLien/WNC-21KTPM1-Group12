import { FeePayment } from "src/modules/transactions/types/FeePayment.type";

type ExternalTransactionResponse = {
  encryptedPayload: string;
  signature: string;
};

export { ExternalTransactionResponse };
