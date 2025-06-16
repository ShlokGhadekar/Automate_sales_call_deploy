const fs = require('fs');
const path = require('path');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: path.resolve(__dirname, '../google_tts_cred.json'),
});

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