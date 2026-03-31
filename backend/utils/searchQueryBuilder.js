const { getTrustedSourcesForClaim } = require('../agents/gemini');

async function buildSearchQuery(extraction, claim) {
    const normalizedExtraction = extraction && typeof extraction === 'object' ? extraction : {};
    const { event, location, time } = normalizedExtraction;
    // Fetch trusted domains dynamically using Gemini
    console.log('Building search query for claim:', claim);
    const trustedDomains = await getTrustedSourcesForClaim(claim);
    let query = `${claim} ${event || ''} ${location || ''} ${time || ''}`.trim();
    if (trustedDomains && trustedDomains.length > 0) {
        const uniqueDomains = Array.from(new Set(trustedDomains));
        query += ' ' + uniqueDomains.map(domain => `site:${domain}`).join(' OR ');
    }
    return query;
}

module.exports = buildSearchQuery; 