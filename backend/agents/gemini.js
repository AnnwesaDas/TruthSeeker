const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const DEFAULT_TIMEOUT_MS = 30000;

function getTextFromGeminiResponse(response) {
    const raw = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return raw.replace(/```json/gi, '').replace(/```/g, '').trim();
}

function safeJsonParse(text) {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function normalizeExtraction(parsed, fallbackClaim) {
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return {
            event: fallbackClaim || 'Unknown event',
            location: 'Unknown',
            time: 'Unknown'
        };
    }

    return {
        event: parsed.event || fallbackClaim || 'Unknown event',
        location: parsed.location || 'Unknown',
        time: parsed.time || 'Unknown'
    };
}

function normalizeVerification(parsed, fallbackText) {
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return {
            result: 'Unverified',
            reasoning: fallbackText || 'Verification response could not be parsed.'
        };
    }

    return {
        result: parsed.result || 'Unverified',
        reasoning: parsed.reasoning || 'No reasoning provided.'
    };
}

function normalizeDomains(parsed) {
    if (!Array.isArray(parsed)) return [];

    return parsed
        .map((entry) => String(entry || '').trim().toLowerCase())
        .filter(Boolean)
        .map((domain) => domain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, ''))
        .filter((domain) => /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain));
}

async function callGemini(prompt) {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured');
    }

    const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
            contents: [{ parts: [{ text: prompt }] }],
        },
        {
            timeout: DEFAULT_TIMEOUT_MS,
        }
    );

    return getTextFromGeminiResponse(response);
}

async function extractEventInfo(claim) {
    try {
        const prompt = `Extract the event name, location, and time from this claim: "${claim}". Respond in JSON with keys: event, location, time.`;
        const text = await callGemini(prompt);
        const parsed = safeJsonParse(text);
        const extraction = normalizeExtraction(parsed, claim);
        console.log('Gemini extractEventInfo response:', extraction);
        return extraction;
    } catch (err) {
        console.error('Gemini extractEventInfo error:', err.message);
        return {
            event: claim || 'Unknown event',
            location: 'Unknown',
            time: 'Unknown'
        };
    }
}

async function getTrustedSourcesForClaim(claim) {
    console.log('Getting trusted sources for claim IN:', claim);
    try {
        const prompt = `Given the following claim: "${claim}", list the most relevant and reputable news or official domains (e.g., bbc.com, reuters.com, gov.in) that would be trusted sources to verify this claim. Respond with a JSON array of domain names only (no explanation).`;
        const text = await callGemini(prompt);
        console.log('Gemini getTrustedSourcesForClaim response:', text);
        const parsed = safeJsonParse(text);
        return normalizeDomains(parsed).slice(0, 8);
    } catch (err) {
        console.error('Gemini getTrustedSourcesForClaim error:', err.message);
        return [];
    }
}
async function verifyClaimWithEvidence(claim, evidence) {
    console.log('Gemini verifyClaimWithEvidence IN:', claim, evidence);
    try {
        const prompt = `Given the following claim: "${claim}"
And the following evidence from trusted news sources:
${JSON.stringify(evidence, null, 2)}

Does the given claim can occur in the given evidence? These sources are mostly about the image and video content that mislead the event details, They wont give the confirmation of the event, But they will give the information about the event.
if you cant decided due to lack of information, search the internet for the event and give the result.
Respond with one of: Occurred, Unlikely, Unverified. Also provide a short reasoning. Return JSON Object with keys: result, reasoning.`;
        const text = await callGemini(prompt);
        const parsed = safeJsonParse(text);
        const verification = normalizeVerification(parsed, text);
        console.log('Gemini verification response:', verification);
        return verification;
    } catch (err) {
        console.error('Gemini verifyClaimWithEvidence error:', err.message);
        return {
            result: 'Unverified',
            reasoning: 'Error during verification.'
        };
    }
}

module.exports = { extractEventInfo, verifyClaimWithEvidence, getTrustedSourcesForClaim };    