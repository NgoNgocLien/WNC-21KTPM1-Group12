import * as crypto from 'crypto';

export interface ResponseData {
    encryptedPayload: string;
    encryptedAESKey: string;
    timestamp: string;
    recipient_signature: string;
    iv: string; // Initialization Vector for AES
  }

function encryptPayloadWithAES(payload: string, aesKey: Buffer): { encryptedPayload: string, iv: string } {
  const iv = crypto.randomBytes(16); // Initialization vector for AES
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  let encrypted = cipher.update(payload, 'utf8', 'base64');
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
export function generateResponseData(payload: string, publicKey: string, hmacKey: string): ResponseData {
  const aesKey = crypto.randomBytes(32); // Generate random AES key for encrypting payload
  const { encryptedPayload, iv } = encryptPayloadWithAES(payload, aesKey);
  const encryptedAESKey = encryptAESKey(aesKey, publicKey); // Encrypt AES key with RSA public key
  const timestamp = Math.floor(Date.now() / 1000).toString(); // Generate timestamp
  const recipient_signature = createHmacSignature(encryptedPayload, timestamp, iv, hmacKey); // HMAC for integrity check
  return { encryptedPayload, encryptedAESKey, timestamp, recipient_signature, iv };
}