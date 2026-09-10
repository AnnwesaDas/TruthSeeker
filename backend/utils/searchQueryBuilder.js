const { getTrustedSourcesForClaim } = require('../agents/gemini');

async function buildSearchQuery(extraction, claim) {
    const normalizedExtraction = extraction && typeof extraction === 'object' ? extraction : {};
    const { event, location, time } = normalizedExtraction;
    console.log('Building search query for claim:', claim);

    const trustedDomains = await getTrustedSourcesForClaim(claim);
    const query = [claim, event, location !== 'Unknown' ? location : '', time !== 'Unknown' ? time : '']
        .filter(Boolean)
        .join(' ')
        .trim();

    return { query, trustedDomains };
}

module.exports = buildSearchQuery;
