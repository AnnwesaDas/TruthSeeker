// Real, previously-verified pipeline output, captured from an actual
// successful run of this exact pipeline (evidence, verdict, and BERT score
// are all genuine, not fabricated). Used only when USE_CACHED_DEMO=true,
// so a live demo (e.g. during an interview) never depends on remaining
// Gemini API quota. Add more entries here after future successful runs.
const DEMO_RESPONSES = {
    'the earth is flat': {
        extraction: {
            event: 'the earth is flat',
            location: 'Unknown',
            time: 'Unknown',
            trustedDomains: ['nasa.gov', 'esa.int', 'scientificamerican.com', 'nationalgeographic.com', 'nature.com', 'science.org', 'bbc.com'],
        },
        evidence: [
            {
                source: 'Google Fact Check',
                headline: 'The Earth is not flat – Full Fact',
                publisher: 'Full Fact',
                claim: 'The Earth is flat.',
                verdict: 'We have abundant evidence going back thousands of years that the Earth is roughly spherical.',
                link: 'https://fullfact.org/online/earth-is-spherical-not-flat/',
                snippet: 'The Earth is not flat – Full Fact',
            },
            {
                source: 'Google Fact Check',
                headline: "No, NASA didn't admit the earth is flat",
                publisher: 'AAP',
                claim: 'NASA has admitted the earth is flat in several documents.',
                verdict: 'False. The post misinterprets common aeronautical flight calculation methodologies.',
                link: 'https://www.aap.com.au/factcheck/no-nasa-didnt-admit-the-earth-is-flat/',
                snippet: "No, NASA didn't admit the earth is flat",
            },
            {
                source: 'Google Fact Check',
                headline: 'Deadly Disinfo: How the Flat Earth Conspiracy Doomed an Amateur ...',
                publisher: 'VOA',
                claim: 'I don’t want to take anyone else’s word for it. I don’t know if the Earth is flat or round.',
                verdict: 'Tragically False',
                link: 'https://www.voanews.com/a/flat-earth-believer-mad-mike-hughes-dies-in-diy-rocket-crash/6742319.html',
                snippet: 'Deadly Disinfo: How the Flat Earth Conspiracy Doomed an Amateur ...',
            },
            {
                source: 'Google Fact Check',
                headline: 'Pictures mislead: Ample evidence the Earth is round and sea levels ...',
                publisher: 'USA Today',
                claim: 'Pictures show the Earth is flat, and sea levels haven’t changed',
                verdict: 'False',
                link: 'https://www.usatoday.com/story/news/factcheck/2023/08/07/false-claim-the-earth-is-flat-and-sea-levels-arent-rising-fact-check/70533704007/',
                snippet: 'Pictures mislead: Ample evidence the Earth is round and sea levels ...',
            },
        ],
        verification: {
            result: 'False',
            reasoning: "The claim 'earth is flat' is unequivocally false. All provided evidence from trusted fact-checking sources directly contradicts this claim, stating that the Earth is roughly spherical or round. For example, Full Fact states, 'We have abundant evidence going back thousands of years that the Earth is roughly spherical,' and USA Today labels the claim 'False.' Additionally, the spherical shape of the Earth is a well-established scientific fact.",
        },
        bertResult: { label: 'fake', confidence: 0.74 },
    },
};

function normalizeClaim(claim) {
    return String(claim || '').trim().toLowerCase();
}

function getDemoResponse(claim) {
    return DEMO_RESPONSES[normalizeClaim(claim)] || null;
}

function listDemoClaims() {
    return Object.keys(DEMO_RESPONSES);
}

module.exports = { getDemoResponse, listDemoClaims };
