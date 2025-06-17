const fs = require('fs');
const path = require('path');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');

const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

const credentials = process.env.GOOGLE_TTS_CRED_JSON
  ? JSON.parse(process.env.GOOGLE_TTS_CRED_JSON)
  : require('../google_tts_cred.json'); // fallback for local dev

const client = new TextToSpeechClient({ credentials });

const writeFile = util.promisify(fs.writeFile);

async function googleTTS({ text }) {
  const request = {
    input: { text },
    voice: {
      languageCode: 'hi-IN',
      name: 'hi-IN-Wavenet-C', // Indian English voice
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
