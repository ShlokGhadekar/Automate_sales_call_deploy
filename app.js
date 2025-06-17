// require('dotenv').config();
// require('colors');
// console.log('SERVER:', process.env.SERVER);

// const express = require('express');
// const ExpressWs = require('express-ws');

// const { GptService } = require('./services/gpt-service');
// const { StreamService } = require('./services/stream-service');
// const { TranscriptionService } = require('./services/transcription-service');
// const { TextToSpeechService } = require('./services/tts-service');
// const { recordingService } = require('./services/recording-service');

// const VoiceResponse = require('twilio').twiml.VoiceResponse;

// const app = express();
// ExpressWs(app);

// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });

// const PORT = process.env.PORT || 3000;

// app.post('/incoming', (req, res) => {
//   try {
//     const response = new VoiceResponse();

//     // Professional greeting with general tech products
//     // response.say('Welcome to Lodha Builders, connecting you to your AI agent.');
//     // response.pause({ length: 2 });
//     //response.say('Thanks for exploring our website. We currently have exciting offers on wireless earbuds starting at 2,999 rupees, smartwatches from 4,999, and tablets starting at just 14,999.');
//     //response.pause({ length: 2 });
//     //response.say('Let me assist you with anything you\'re interested in.');

//     const connect = response.connect();
//     connect.stream({ url: `wss://${process.env.SERVER}/connection` });

//     response.pause({ length: 600 }); // 10-minute pause for conversation

//     res.type('text/xml');
//     res.send(response.toString());
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// app.ws('/connection', (ws) => {
//   try {
//     ws.on('error', console.error);
//     let streamSid;
//     let callSid;

//     const gptService = new GptService();
//     const streamService = new StreamService(ws);
//     const transcriptionService = new TranscriptionService();
//     const ttsService = new TextToSpeechService({});

//     let marks = [];
//     let interactionCount = 0;

//     ws.on('message', function message(data) {
//       const msg = JSON.parse(data);
//       if (msg.event === 'start') {
//         streamSid = msg.start.streamSid;
//         callSid = msg.start.callSid;

//         streamService.setStreamSid(streamSid);
//         gptService.setCallSid(callSid);

//         recordingService(ttsService, callSid).then(() => {
//           console.log(`Twilio -> Starting Media Stream for ${streamSid}`.underline.red);
//          ttsQueue.push({
//   gptReply: {
//     partialResponseIndex: null,
//     partialResponse: "लोधा बिल्डर्स में आपका स्वागत है, हम आपको हमारे एआई एजेंट से जोड़ रहे हैं।",
//   },
//   icount: 0,
// });

// ttsQueue.push({
//   gptReply: {
//     partialResponseIndex: null,
//     partialResponse: "नमस्ते! क्या आप मुंबई या पुणे में नया घर खरीदने में रुचि रखते हैं?",
//   },
//   icount: 1,
// });

// processTtsQueue(); // small delay to avoid audio overlap
//         });

//       } else if (msg.event === 'media') {
//         transcriptionService.send(msg.media.payload);
//       } else if (msg.event === 'mark') {
//         const label = msg.mark.name;
//         console.log(`Twilio -> Audio completed mark (${msg.sequenceNumber}): ${label}`.red);
//         marks = marks.filter(m => m !== msg.mark.name);
//       } else if (msg.event === 'stop') {
//         console.log(`Twilio -> Media stream ${streamSid} ended.`.underline.red);
//       }
//     });

//     transcriptionService.on('utterance', async (text) => {
//       if (marks.length > 0 && text?.length > 5) {
//         console.log('Twilio -> Interruption, Clearing stream'.red);
//         ws.send(JSON.stringify({
//           streamSid,
//           event: 'clear',
//         }));
//       }
//     });

//     transcriptionService.on('transcription', async (text) => {
//   if (!text) return;
  
//   try {
//     const { text: englishText } = await translate(text, { to: 'en' });
//     console.log(`Interaction ${interactionCount} – STT(Hindi) -> EN -> GPT: ${englishText}`.yellow);
//     gptService.completion(englishText, interactionCount);
//     interactionCount += 1;
//   } catch (err) {
//     console.error('Error translating user input:', err);
//   }
// });

//     const ttsQueue = [];
// let isTtsGenerating = false;

// async function processTtsQueue() {
//   if (isTtsGenerating || ttsQueue.length === 0) return;

//   isTtsGenerating = true;
//   const { gptReply, icount } = ttsQueue.shift();

//   try {
//     console.log(`Interaction ${icount}: GPT -> TTS (Queued): ${gptReply.partialResponse}`.green);
//     await ttsService.generate(gptReply, icount);
//   } catch (err) {
//     console.error(`TTS generation failed:`, err);
//   } finally {
//     isTtsGenerating = false;
//     processTtsQueue(); // Continue to next
//   }
// }

// const translate = require('google-translate-api-x'); // Add this at the top

// gptService.on('gptreply', async (gptReply, icount) => {
//   try {
//     // Translate GPT response to Hindi
//     const result = await translate(gptReply.partialResponse, { to: 'hi' });

//     const hindiReply = {
//       ...gptReply,
//       partialResponse: result.text,
//     };

//     console.log(`Interaction ${icount}: GPT -> Hindi -> TTS: ${hindiReply.partialResponse}`.green);
//     ttsService.generate(hindiReply, icount);
//   } catch (err) {
//     console.error('Translation error:', err);
//   }
// });

//     ttsService.on('speech', (responseIndex, audio, label, icount) => {
//       console.log(`Interaction ${icount}: TTS -> TWILIO: ${label}`.blue);
//       streamService.buffer(responseIndex, audio);
//     });

//     streamService.on('audiosent', (markLabel) => {
//       marks.push(markLabel);
//     });

//   } catch (err) {
//     console.log(err);
//   }
// });

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
// });
const fs = require('fs');

fs.mkdirSync('tmp', { recursive: true });
require('dotenv').config();
require('colors');
const translate = require('google-translate-api-x'); // Moved to top for clarity

console.log('SERVER:', process.env.SERVER);

const express = require('express');
const ExpressWs = require('express-ws');

const { GptService } = require('./services/gpt-service');
const { StreamService } = require('./services/stream-service');
const { TranscriptionService } = require('./services/transcription-service');
const { TextToSpeechService } = require('./services/tts-service');
const { recordingService } = require('./services/recording-service');

const VoiceResponse = require('twilio').twiml.VoiceResponse;

const app = express();
ExpressWs(app);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

const PORT = process.env.PORT || 3000;

app.post('/incoming', (req, res) => {
  try {
    const response = new VoiceResponse();

    // Professional greeting with general tech products
    // response.say('Welcome to Lodha Builders, connecting you to your AI agent.');
    // response.pause({ length: 2 });
    // response.say('Thanks for exploring our website. We currently have exciting offers on wireless earbuds starting at 2,999 rupees, smartwatches from 4,999, and tablets starting at just 14,999.');
    // response.pause({ length: 2 });
    // response.say('Let me assist you with anything you\'re interested in.');

    const connect = response.connect();
    connect.stream({ url: `wss://${process.env.SERVER}/connection` });

    response.pause({ length: 600 }); // 10-minute pause for conversation

    res.type('text/xml');
    res.send(response.toString());
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.ws('/connection', (ws) => {
  try {
    ws.on('error', console.error);
    let streamSid;
    let callSid;

    const gptService = new GptService();
    const streamService = new StreamService(ws);
    const transcriptionService = new TranscriptionService();
    const ttsService = new TextToSpeechService();

    let marks = [];
    let interactionCount = 0;

    const ttsQueue = [];
    let isTtsGenerating = false;

    async function processTtsQueue() {
  if (isTtsGenerating || ttsQueue.length === 0) return;

  isTtsGenerating = true;
  const { gptReply, icount } = ttsQueue.shift();

  try {
    console.log(`Interaction ${icount}: GPT -> TTS (Queued): ${gptReply.partialResponse}`.green);
    await ttsService.generate(gptReply, icount);
    // ⚠️ do not set isTtsGenerating = false here — we do that only when mark is received
  } catch (err) {
    console.error(`TTS generation failed:`, err);
    isTtsGenerating = false;
    processTtsQueue(); // Skip to next one
  }
}

    ws.on('message', function message(data) {
      const msg = JSON.parse(data);

      if (msg.event === 'start') {
  streamSid = msg.start.streamSid;
  callSid = msg.start.callSid;

  streamService.setStreamSid(streamSid);
  gptService.setCallSid(callSid);

  console.log(`Twilio -> Starting Media Stream for ${streamSid}`.underline.red);

  // Delay TTS until Twilio is actually ready
  setTimeout(() => {
    ttsQueue.push({
      gptReply: {
        partialResponseIndex: null,
        partialResponse: "लोधा बिल्डर्स में आपका स्वागत है, हम आपको हमारे एआई एजेंट से जोड़ रहे हैं।",
      },
      icount: 0,
    });

    ttsQueue.push({
      gptReply: {
        partialResponseIndex: null,
        partialResponse: "नमस्ते! क्या आप मुंबई या पुणे में नया घर खरीदने में रुचि रखते हैं?",
      },
      icount: 1,
    });

    processTtsQueue(); // start after delay
  }, 300); // 300ms delay to make sure Twilio is ready
} else if (msg.event === 'media') {
        transcriptionService.send(msg.media.payload);

      } else if (msg.event === 'mark') {
        const label = msg.mark.name;
        console.log(`Twilio -> Audio completed mark (${msg.sequenceNumber}): ${label}`.red);
        marks = marks.filter(m => m !== label);

      } else if (msg.event === 'stop') {
        console.log(`Twilio -> Media stream ${streamSid} ended.`.underline.red);
      }
    });

    transcriptionService.on('utterance', async (text) => {
      if (marks.length > 0 && text?.length > 5) {
        console.log('Twilio -> Interruption, Clearing stream'.red);
        ws.send(JSON.stringify({
          streamSid,
          event: 'clear',
        }));
      }
    });

    transcriptionService.on('transcription', async (text) => {
      if (!text) return;

      try {
        const { text: englishText } = await translate(text, { to: 'en' });
        console.log(`Interaction ${interactionCount} – STT(Hindi) -> EN -> GPT: ${englishText}`.yellow);
        gptService.completion(englishText, interactionCount);
        interactionCount += 1;
      } catch (err) {
        console.error('Error translating user input:', err);
      }
    });

    gptService.on('gptreply', async (gptReply, icount) => {
      try {
        // Translate GPT response to Hindi
        const result = await translate(gptReply.partialResponse, { to: 'hi' });

        const hindiReply = {
          ...gptReply,
          partialResponse: result.text,
        };

        console.log(`Interaction ${icount}: GPT -> Hindi -> TTS: ${hindiReply.partialResponse}`.green);

        // Enqueue the Hindi TTS reply
        ttsQueue.push({ gptReply: hindiReply, icount });
        processTtsQueue();
      } catch (err) {
        console.error('Translation error:', err);
      }
    });

   ttsService.on('speech', (responseIndex, audio, label, icount) => {
  console.log(`Interaction ${icount}: TTS -> TWILIO: ${label}`.blue);

  // Send audio
  streamService.buffer(responseIndex, audio, label);

  // Wait for TWILIO to confirm this mark before sending next
  const waitForMark = (markLabel) => {
    if (markLabel === label) {
      streamService.off('audiosent', waitForMark);
      isTtsGenerating = false;
      processTtsQueue(); // now continue
    }
  };

  streamService.on('audiosent', waitForMark);
});

   

  } catch (err) {
    console.log(err);
  }
});
// At the top, with your imports:
const { makeOutBoundCall } = require('./scripts/outbound-call');

// Add this route before app.listen
app.post('/api/start-call', async (req, res) => {
  try {
    await makeOutBoundCall();
    res.status(200).json({ message: 'Outbound call started' });
  } catch (err) {
    console.error('Server -> Failed to start call:', err);
    res.status(500).json({ error: 'Failed to start outbound call' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
