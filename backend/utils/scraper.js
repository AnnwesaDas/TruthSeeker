const puppeteer = require('puppeteer');
const { getTrustedSourcesForClaim } = require('../agents/gemini');

function extractDomainsFromQuery(query) {
    const matches = query.match(/site:([^\s]+)/g) || [];
    return matches
        .map((entry) => entry.replace(/^site:/, '').trim().toLowerCase())
        .filter(Boolean);
}

// Remove or comment out static TRUSTED_DOMAINS usage
// const TRUSTED_DOMAINS = [
//     'bbc.com',
//     'reuters.com',
//     'indiatimes.com',
//     'gov.in',
// ];

async function scrapeGoogleFactChecker(query) {
    const results = [];
    let browser;
    query = query.replace(/(\s*OR\s*)?site:[^\s]+/g, '').trim();
 
    console.log(query);
    try {
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.goto('https://toolbox.google.com/factcheck/explorer', { waitUntil: 'networkidle2', timeout: 30000 });
        await page.waitForSelector('input#search-input[name="query"]', { timeout: 10000 });
        await page.type('input#search-input[name="query"]', query);
        await Promise.all([
            page.keyboard.press('Enter'),
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
        ]);
        // Wait for results to load
        await page.waitForTimeout(2000);
        console.log('Google Fact Checker results loaded');
        const factChecks = await page.evaluate(() => {
            // The path: /html/body/fact-check-tools/div/mat-sidenav-container/mat-sidenav-content/div/search-results-page/div/div[4]/fc-results-list/div[1]/div
            // We'll select all fact divs under fc-results-list
            const factDivs = document.querySelectorAll('fc-results-list > div > div');
            console.log("factDivs", factDivs);
            return Array.from(factDivs).slice(0, 5).map(div => {
                // extract headline, publisher, claim, verdict, link, etc.
                const headline = div.querySelector('.snippet-title')?.innerText || '';
                const publisher = div.querySelector('div:nth-child(3) > div:nth-child(3) > div > span > span:nth-child(1)')?.innerText || '';
                const claim = div.querySelector('div:nth-child(3) > div:nth-child(2)')?.innerText || '';
                const verdict = div.querySelector('.rating')?.innerText || '';
                const link = div.querySelector('div:nth-child(3) > div:nth-child(3) > div > div:nth-child(2) a')?.href || '';
                console.log('Google Fact Checker result:', { source: 'Google Fact Check', headline, publisher, claim, verdict, link });
                return { source: 'Google Fact Check', headline, publisher, claim, verdict, link };
            });
        });
        console.log('Number of fact checks found:', factChecks.length);
        console.log('factChecks', factChecks);
        results.push(...factChecks);
        await page.close();
    } catch (err) {
        console.error('Google Fact Checker scraping error:', err.message);
    } finally {
        if (browser) await browser.close();
    }
    return results;
}

async function searchAndScrape(query) {
    console.log('Searching and scraping with query:', query);
    let browser;
    let results = [];
    try {
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.goto('https://search.yahoo.com/', { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait for the Yahoo search box
        await page.waitForSelector('input[name="p"]', { timeout: 10000 }); 
        await page.type('input[name="p"]', query);
        await Promise.all([
            page.keyboard.press('Enter'),
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
        ]);

        // Get Yahoo organic result links
        const linkHandles = await page.$$('ol > li > div > div:nth-child(1) > a');
        let links = [];
        for (const handle of linkHandles) {
            const href = await page.evaluate(a => a.href, handle);
            links.push(href);
        }
        console.log('All found links:', links);
        // Reuse domains already added by query-builder when present.
        let trustedDomains = [];
        trustedDomains = extractDomainsFromQuery(query);
        if (trustedDomains.length === 0) {
            try {
                trustedDomains = await getTrustedSourcesForClaim(query);
                console.log('Dynamic trusted domains:', trustedDomains);
            } catch (err) {
                console.error('Error getting trusted domains:', err.message);
            }
        }
        // Filter by dynamic trusted domains
        if (trustedDomains && trustedDomains.length > 0) {
            links = links.filter(link => trustedDomains.some(domain => link.includes(domain)));
        } else {
            console.warn('No trusted domains found, skipping domain filtering.');
        }
        links = Array.from(new Set(links)).slice(0, 5);
        console.log('Filtered trusted links:', links);

        for (const link of links) {
            try {
                const newPage = await browser.newPage();
                await newPage.goto(link, { waitUntil: 'domcontentloaded', timeout: 20000 });
                // Try to get meta description or first paragraph
                const snippet = await newPage.evaluate(() => {
                    const meta = document.querySelector('meta[name="description"]');
                    if (meta && meta.content) return meta.content;
                    const p = document.querySelector('p');
                    if (p) return p.innerText;
                    return '';
                });
                results.push({ link, snippet });
                await newPage.close();
            } catch (err) {
                results.push({ link, snippet: 'Failed to scrape content.' });
            }
        }
    } catch (err) {
        console.error('Puppeteer DuckDuckGo search error:', err.message);
    } finally {
        if (browser) await browser.close();
    }
    // Scrape Google Fact Checker and merge results
    const factCheckResults = await scrapeGoogleFactChecker(query);
    console.log('factCheckResults CHECKED', factCheckResults);
    return [...results, ...factCheckResults];
}

module.exports = { searchAndScrape }; 