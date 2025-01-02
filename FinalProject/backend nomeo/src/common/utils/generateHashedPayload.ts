import * as crypto from 'crypto';

// Interface definitions
interface Payload {
  sender_account_number: string;
  recipient_account_number: string;
  transaction_amount: string;
  transaction_message: string;
  fee_payment_method: string;
}

interface RequestData {
  encryptedPayload: string;
  encryptedAESKey: string;
  timestamp: string;
  signature: string;
  iv: string; // Initialization Vector for AES
}

// Example payload
const payload: Payload = {
  sender_account_number: "TEC1234567",
  recipient_account_number: "ACC123456789",
  transaction_amount: "50000",
  transaction_message: "",
  fee_payment_method: "SENDER"
};

// RSA Public Key of the recipient (for encrypting AES key)
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfSya4WAyspV+kRO68PMD5qItt
f1B3cxSLooTr9bWVIny8GJ8Yer6HMjH2B2xmzI+1sySf5BMD53xECWCq0GgnwZn7
fQhOgFSG+gmn2U0IKajgGCYuttWKn+w4yjuDu2YyA8aAd5yy/5eM1+ODe/VcThVa
1WqZFQq/MCj9tVSmTQIDAQAB
-----END PUBLIC KEY-----`;

// Secret key for HMAC (for signing the request data)
const hmacKey = 'TECHBANK_NOMEOBANK'; // HMAC key for verifying integrity

// Function to encrypt payload using AES
function encryptPayloadWithAES(payload: Payload, aesKey: Buffer): { encryptedPayload: string, iv: string } {
  const iv = crypto.randomBytes(16); // Initialization vector for AES
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return { encryptedPayload: encrypted, iv: iv.toString('base64') };
}

// Function to encrypt AES key using RSA public key
function encryptAESKey(aesKey: Buffer, publicKey: string): string {
  const encryptedKey = crypto.publicEncrypt(publicKey, aesKey);
  return encryptedKey.toString('base64');
}

// Function to create HMAC signature for the request data
function createHmacSignature(encryptedPayload: string, timestamp: string, iv: string, hmacKey: string): string {
  return crypto.createHmac('sha256', hmacKey).update(encryptedPayload + timestamp + iv).digest('hex');
}

// Function to generate the full request data
function generateRequestData(payload: Payload, publicKey: string, hmacKey: string): RequestData {
  const aesKey = crypto.randomBytes(32); // Generate random AES key for encrypting payload
  const { encryptedPayload, iv } = encryptPayloadWithAES(payload, aesKey);
  const encryptedAESKey = encryptAESKey(aesKey, publicKey); // Encrypt AES key with RSA public key
  const timestamp = Math.floor(Date.now() / 1000).toString(); // Generate timestamp
  const signature = createHmacSignature(encryptedPayload, timestamp, iv, hmacKey); // HMAC for integrity check
  return { encryptedPayload, encryptedAESKey, timestamp, signature, iv };
}

// Generate the request data
const requestData1 = generateRequestData(payload, publicKey, hmacKey);
console.log('Request Data 1:', requestData1);

// const timestamp = Math.floor(Date.now() / 1000).toString();
// const requestData2 = crypto.createHmac('sha256', hmacKey).update("ACC123456789" + timestamp).digest('hex');
// console.log('Request Data 2:', {
//     timestamp,
//     requestData2
// });
