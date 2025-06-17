const fs = require('fs');
const path = require('path');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');

const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

// SAFELY load credentials from env or local file
let credentials;
try {
  credentials = process.env.GOOGLE_TTS_CRED_JSON
    ? JSON.parse(process.env.GOOGLE_TTS_CRED_JSON)
    : require('../google_tts_cred.json');
} catch (err) {
  console.error('❌ Google TTS credentials missing or malformed', err);
  process.exit(1);
}

const client = new TextToSpeechClient({ credentials });

const writeFile = util.promisify(fs.writeFile);

async function googleTTS({ text }) {
  const request = {
    input: { text },
    voice: {
      languageCode: 'hi-IN',
      name: 'hi-IN-Wavenet-C',
    },
    audioConfig: {
      audioEncoding: 'MULAW',
      sampleRateHertz: 8000,
    },
  };

  const [response] = await client.synthesizeSpeech(request);

  const filename = `speech-${Date.now()}.ulaw`;
  const filepath = path.join(__dirname, '../tmp', filename);

  await writeFile(filepath, response.audioContent, 'binary');
  return filepath;
}

module.exports = googleTTS;
