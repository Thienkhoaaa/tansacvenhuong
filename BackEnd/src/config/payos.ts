import PayOS from '@payos/node';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.PAYOS_CLIENT_ID || '';
const apiKey = process.env.PAYOS_API_KEY || '';
const checksumKey = process.env.PAYOS_CHECKSUM_KEY || '';

export const isPayOSConfigured = Boolean(clientId && apiKey && checksumKey);

let payOSClient: PayOS | null = null;

if (isPayOSConfigured) {
  try {
    payOSClient = new PayOS(clientId, apiKey, checksumKey);
    console.log('✅ PayOS SDK initialized successfully with real credentials.');
  } catch (err) {
    console.warn('⚠️ Failed to initialize PayOS client, falling back to simulated mode:', err);
  }
} else {
  console.log('ℹ️ PayOS credentials not provided. Running in VietQR dynamic simulation mode.');
}

export { payOSClient };
