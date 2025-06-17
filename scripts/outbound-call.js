// outbound-call.js
require('dotenv').config();
const twilio = require('twilio');

async function makeOutBoundCall() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  const client = twilio(accountSid, authToken);

  try {
    const call = await client.calls.create({
      url: `https://${process.env.SERVER}/incoming`,
      to: process.env.YOUR_NUMBER,
      from: process.env.FROM_NUMBER,
      record: true,
    });
    console.log('Twilio -> Call SID:', call.sid);
  } catch (error) {
    console.error('Twilio -> Call failed:', error);
    throw error;
  }
}

module.exports = { makeOutBoundCall };
