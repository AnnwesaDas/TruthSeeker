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
            time: 'Unknown',
            trustedDomains: []
        };
    }

    return {
        event: parsed.event || fallbackClaim || 'Unknown event',
        location: parsed.location || 'Unknown',
        time: parsed.time || 'Unknown',
        trustedDomains: normalizeDomains(parsed.trustedDomains).slice(0, 8)
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

// Combines what used to be two separate Gemini calls (extraction, then
// trusted-domain lookup) into one, to stay within the free-tier daily
// request quota — each claim now costs 2 Gemini calls instead of 3.
async function extractEventAndSources(claim) {
    try {
        const prompt = `Given this claim: "${claim}"

1. Extract the event name, location, and time referenced in the claim.
2. List up to 8 reputable news or official domains (e.g. bbc.com, reuters.com, gov.in) that would be trusted sources to verify this specific claim.

Respond with a JSON object with keys: event, location, time, trustedDomains (an array of domain names only, no explanation).`;
        const text = await callGemini(prompt);
        const parsed = safeJsonParse(text);
        const extraction = normalizeExtraction(parsed, claim);
        console.log('Gemini extractEventAndSources response:', extraction);
        return extraction;
    } catch (err) {
        console.error('Gemini extractEventAndSources error:', err.message);
        return {
            event: claim || 'Unknown event',
            location: 'Unknown',
            time: 'Unknown',
            trustedDomains: []
        };
    }
}

async function verifyClaimWithEvidence(claim, evidence, bertResult = null) {
    console.log('Gemini verifyClaimWithEvidence IN:', claim, evidence);
    try {
        const bertLine = bertResult && bertResult.label !== 'unknown'
            ? `\nML model pre-classification: "${bertResult.label}" with ${Math.round(bertResult.confidence * 100)}% confidence.`
            : '';

        const prompt = `You are a fact-checker. Given the claim: "${claim}"${bertLine}
And the following evidence from trusted news and fact-check sources:
${JSON.stringify(evidence, null, 2)}

Determine whether the claim itself is factually accurate, using the evidence above. If the evidence is insufficient, use your own knowledge to reach a conclusion where possible.

Respond with exactly one of these four results:
- "True": the evidence (or well-established fact) confirms the claim is accurate.
- "False": the evidence (or well-established fact) contradicts or debunks the claim.
- "Misleading": the claim has some factual basis but is presented out of context or in a deceptive way.
- "Unverified": there is genuinely not enough information to determine truth or falsity either way.

Critical rule: your "result" value MUST match the conclusion of your own "reasoning". If your reasoning explains that the claim is false or debunked, the result must be "False", never "True" or anything else. Do not choose "True" merely because the claim is a real topic being discussed or fact-checked — "True" means the claim's content is actually accurate.

Return a JSON object with keys: result, reasoning.`;
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

module.exports = { extractEventAndSources, verifyClaimWithEvidence };
