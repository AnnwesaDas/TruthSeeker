const axios = require('axios');

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Bot protection is optional: without TURNSTILE_SECRET_KEY configured,
// verification is skipped entirely (same graceful-degradation pattern used
// for other optional services in this app).
async function verifyTurnstile(token) {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) return true;

    if (!token) return false;

    try {
        const response = await axios.post(
            VERIFY_URL,
            new URLSearchParams({ secret: secretKey, response: token }),
            { timeout: 10000 }
        );
        return Boolean(response.data?.success);
    } catch (err) {
        console.error('Turnstile verification error:', err.message);
        return false;
    }
}

module.exports = { verifyTurnstile };
