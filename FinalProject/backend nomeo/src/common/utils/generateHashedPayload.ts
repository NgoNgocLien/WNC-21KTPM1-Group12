import * as crypto from 'crypto';


const payload = JSON.stringify(undefined);
const timestamp = Math.floor(Date.now() / 1000).toString();
console.log(timestamp);
const secretKey = 'TECHBANK_NOMEOBANK';
const hash = crypto.createHmac('sha256', secretKey).update(payload + timestamp).digest('hex');
console.log(hash);
  