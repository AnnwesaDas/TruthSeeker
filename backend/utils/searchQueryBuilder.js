// Pure string-building — no Gemini call here. Trusted domains now come
// from gemini.extractEventAndSources(), which already produced them in
// the same call as the event/location/time extraction.
function buildSearchQuery(extraction, claim) {
    const normalizedExtraction = extraction && typeof extraction === 'object' ? extraction : {};
    const { event, location, time } = normalizedExtraction;

    return [claim, event, location !== 'Unknown' ? location : '', time !== 'Unknown' ? time : '']
        .filter(Boolean)
        .join(' ')
        .trim();
}

module.exports = buildSearchQuery;
