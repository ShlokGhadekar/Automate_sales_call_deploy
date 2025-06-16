/*
  You can use this script to place an outbound call
  to your own mobile phone.
*/

// require('dotenv').config();

// async function makeOutBoundCall() {
//   const accountSid = process.env.TWILIO_ACCOUNT_SID;
//   const authToken = process.env.TWILIO_AUTH_TOKEN;

//   const client = require('twilio')(accountSid, authToken);

//   try {
//     const call = await client.calls.create({
//       url: `https://${process.env.SERVER}/incoming`,
//       to: process.env.YOUR_NUMBER,
//       from: process.env.FROM_NUMBER
//     });
//     console.log('Call SID:', call.sid);
//   } catch (error) {
//     console.error('Call error:', error);
//   }
// }

// makeOutBoundCall();

require('dotenv').config();
console.log('Twilio SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('Twilio Token:', process.env.TWILIO_AUTH_TOKEN);
console.log('Server URL:', process.env.SERVER);
//lodha builder type prompt

async function makeOutBoundCall() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  const client = require('twilio')(accountSid, authToken);

  await client.calls
    .create({
      url: `https://${process.env.SERVER}/incoming`,
      to: process.env.YOUR_NUMBER,
      from: process.env.FROM_NUMBER,
      record: true
    })
    .then(call => console.log(call.sid));
}

makeOutBoundCall();