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
  hashedPayload: string;
  signature: string;
}

// Example payload
const payload: Payload = {
  sender_account_number: "TEC1234567",
  recipient_account_number: "ACC123456789",
  transaction_amount: "20000",
  transaction_message: "test rsa",
  fee_payment_method: "SENDER"
};

// recipient
const publicKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAwmCxKNr8KJ0aiIY4sVRxBHvTqOnyVCTc5Dwqj8RCQHwe9d/G4iI2YkLphBUkezrmEklx0gw/nqeHDZaPep15N4E10aVrbCA2ko7DVTw6eLE35SALqfWU2ffW6MVcfE8DpU6tLJ3RC7dxW2gvOzea3tWdioJYLxqyw8ecm3q9kLjuepxqsX8exJ6P8D4HkPTSqiHd6b5DcFQN/81+BHqiPypy5TE+6v8XjkmryPuilp0dV93ZvZ7MM0Cie5ER5NeXx4Z0tZF3pnfZ8WtWUBxNuKQCqyuWQRxSYr/NeGsODI3vQtkfyA4o1ksXybmV7Blc3dPTGFn0O9i6yH5KAJAuLjlNA5BGKqdN02+uVMxaiKPyoRKi2cYLX3P/U/ugLv31Zm7fQV9Mg9Pv6RsRJVr+ykocUud3cjdYzTO4PoLVaxf/mfDMEbuH99WwNZE2FayDlJc+0H06sh8v78Y+AvQuUVBMZRfZbSeci4FrRZC6Xa/ifAmC7mI7zcgwGaxTM4fLp6FxiNmwYEy/VDsv4z0C7VcnPMsW6xjpIL8Hz3R8jlb48J65gzXzYPvYFf8DfogANlWHRuKUdwZwjDdw+L2Xz/wqCrbAmy8U/Ug3FxX+ZOoa/D9webN/dy4kprO0zP9ZdQEmnSTlI+emXyk6/OV8Kb8rewv9kIaKjuz3qhCQFsECAwEAAQ==
-----END PUBLIC KEY-----`;

// sender
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`

// Secret key for HMAC (for signing the request data)
const hmacKey = 'TECHBANK_NOMEOBANK'; 

// Function to generate the full request data
  function hashPayload(data: string, secret_key: string){
    return crypto.createHash('sha256')
      .update(data + secret_key)  
      .digest('hex');
  }

  function encryptData(data: string, public_key: string){
    const dataBuffer = Buffer.from(data);
    const encryptedPayload = crypto.publicEncrypt(public_key, dataBuffer).toString('base64');
    return encryptedPayload;
  }

  function createSignature(data: string, private_key: string){
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();

    return sign.sign(private_key, 'base64');
  }



// POST /transactions/external/receive

const data1 = JSON.stringify({
  ...payload,
  timestamp: Math.floor(Date.now() / 1000).toString()
})
const encryptData1 = encryptData(data1, publicKey);
const hashData1 = hashPayload(encryptData1, hmacKey);
const signature = createSignature(encryptData1, privateKey)

console.log('Request Data 1:', {
  hashData1,
  encryptData1,
  signature
});


// POST /transactions/recipient_profile

const data2 = JSON.stringify({
  accountNumber: "ACC123456789",
  timestamp: Math.floor(Date.now() / 1000).toString()
})
const hashData2 = hashPayload(data2, hmacKey);
console.log('Request Data 2:', {
  data2,
  hashData2
});

