require('dotenv').config();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function sendHi() {
  try {
    console.log('Sending "hi" to Gemini API...');

    const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      contents: [{ parts: [{ text: 'hi' }] }],
    });

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('Reply:', reply || '[empty response]');
  } catch (err) {
    console.error('Gemini ping failed:', err.response?.status, err.response?.statusText);
    console.error('Message:', err.message);
    process.exitCode = 1;
  }
}

sendHi();
