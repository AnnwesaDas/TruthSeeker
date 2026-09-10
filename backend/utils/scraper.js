const axios = require('axios');
const cheerio = require('cheerio');

const FACTCHECK_API_URL = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';
const CUSTOM_SEARCH_API_URL = 'https://www.googleapis.com/customsearch/v1';
const REQUEST_TIMEOUT_MS = 10000;

// Official Google Fact Check Tools API — replaces scraping toolbox.google.com/factcheck/explorer.
async function fetchFactChecks(query) {
    const apiKey = process.env.GOOGLE_FACTCHECK_API_KEY;
    if (!apiKey) {
        console.warn('GOOGLE_FACTCHECK_API_KEY not configured — skipping Fact Check Tools API.');
        return [];
    }

    try {
        const response = await axios.get(FACTCHECK_API_URL, {
            params: { query, key: apiKey, languageCode: 'en' },
            timeout: REQUEST_TIMEOUT_MS,
        });
        const claims = response.data?.claims || [];
        return claims.slice(0, 5).map((claim) => {
            const review = claim.claimReview?.[0] || {};
            return {
                source: 'Google Fact Check',
                headline: review.title || claim.text || '',
                publisher: review.publisher?.name || '',
                claim: claim.text || '',
                verdict: review.textualRating || '',
                link: review.url || '',
                snippet: review.title || claim.text || '',
            };
        });
    } catch (err) {
        console.error('Fact Check Tools API error:', err.message);
        return [];
    }
}

// Optional: Google Programmable Search Engine, restricted to trusted domains.
// Degrades gracefully (returns []) when not configured, same pattern as the BERT fallback.
async function searchTrustedNews(query, trustedDomains) {
    const apiKey = process.env.GOOGLE_CSE_API_KEY;
    const cx = process.env.GOOGLE_CSE_ID;
    if (!apiKey || !cx) {
        console.warn('GOOGLE_CSE_API_KEY/GOOGLE_CSE_ID not configured — skipping general news search.');
        return [];
    }

    try {
        const siteFilter = trustedDomains && trustedDomains.length > 0
            ? ' ' + trustedDomains.map((domain) => `site:${domain}`).join(' OR ')
            : '';
        const response = await axios.get(CUSTOM_SEARCH_API_URL, {
            params: { key: apiKey, cx, q: `${query}${siteFilter}`, num: 5 },
            timeout: REQUEST_TIMEOUT_MS,
        });
        const items = response.data?.items || [];
        return items.map((item) => ({ link: item.link, snippet: item.snippet || '' }));
    } catch (err) {
        console.error('Custom Search API error:', err.message);
        return [];
    }
}

// Lightweight HTTP fetch + HTML parse instead of a full headless browser per link.
async function fetchArticleSnippet(link) {
    try {
        const response = await axios.get(link, {
            timeout: REQUEST_TIMEOUT_MS,
            maxContentLength: 2 * 1024 * 1024,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TruthSeekerBot/1.0)' },
        });
        const $ = cheerio.load(response.data);
        const meta = $('meta[name="description"]').attr('content');
        if (meta && meta.trim()) return meta.trim();
        const firstParagraph = $('p').first().text().trim();
        return firstParagraph ? firstParagraph.slice(0, 500) : '';
    } catch (err) {
        return 'Failed to fetch article content.';
    }
}

async function searchAndScrape(query, trustedDomains = []) {
    console.log('Searching and scraping with query:', query);

    const [factChecks, newsResults] = await Promise.all([
        fetchFactChecks(query),
        searchTrustedNews(query, trustedDomains),
    ]);

    const enrichedNews = await Promise.all(
        newsResults.map(async (item) => {
            if (item.snippet && item.snippet.length > 20) return item;
            return { ...item, snippet: await fetchArticleSnippet(item.link) };
        })
    );

    const results = [...enrichedNews, ...factChecks];
    console.log('Number of evidence items found:', results.length);
    return results;
}

module.exports = { searchAndScrape };
