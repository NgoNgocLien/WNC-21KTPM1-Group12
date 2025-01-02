import * as crypto from 'crypto';
import { ExternalTransactionPayload } from 'src/modules/auth/types/ExternalTransactionPayload';


export function decryptAESKeyWithRsa (encryptedAESKey: string, privateKey: string): Buffer {
    const encryptedBuffer = Buffer.from(encryptedAESKey, 'base64');
    return crypto.privateDecrypt(privateKey, encryptedBuffer);
}

  // Decrypt payload using AES Key
export function decryptPayloadWithAES(encryptedPayload: string, aesKey: Buffer, iv: string): ExternalTransactionPayload {
    const ivBuffer = Buffer.from(iv, 'base64');
    const encryptedBuffer = Buffer.from(encryptedPayload, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, ivBuffer);
    let decrypted = decipher.update(encryptedBuffer, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}

  // Verify HMAC Signature
export function verifySignature(encryptedPayload: string, timestamp: string, iv: string, signature: string, hmacKey: string): boolean {
    const expectedSignature = crypto.createHmac('sha256', hmacKey)
        .update(encryptedPayload + timestamp + iv)  // Concatenate encryptedPayload, timestamp, and iv
        .digest('hex');
    return expectedSignature === signature;
}