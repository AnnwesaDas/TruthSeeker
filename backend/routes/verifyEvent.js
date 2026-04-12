const express = require('express');
const axios = require('axios');
const router = express.Router();
const gemini = require('../agents/gemini');
const buildSearchQuery = require('../utils/searchQueryBuilder');
const { searchAndScrape } = require('../utils/scraper');
const mongoose = require('mongoose');
const VerificationEvent = require('../models/VerificationEvent');
const { authenticateToken } = require('../utils/auth');

async function getBertScore(claim) {
    try {
        const response = await axios.post('http://localhost:5001/predict', { claim });
        return response.data; // { label: "fake"/"real", confidence: 0.73 }
    } catch (err) {
        console.warn('BERT API unavailable:', err.message);
        return { label: 'unknown', confidence: 0 };
    }
}

// Get WebSocket clients from app.js
let wsClients = null;
const setWsClients = (clients) => {
    wsClients = clients;
};

// Function to send WebSocket message to all clients
const sendWsMessage = (message) => {
    if (wsClients) {
        const messageStr = JSON.stringify(message);
        wsClients.forEach(client => {
            if (client.readyState === 1) { // WebSocket.OPEN
                client.send(messageStr);
            }
        });
    }
};

router.post('/', authenticateToken, async (req, res, next) => {
    console.log('Received request');
    try {
        const claim = String(req.body?.claim || '').trim();
        if (!claim) return res.status(400).json({ error: 'Missing claim' });
        const bertResult = await getBertScore(claim);
        console.log('BERT score:', bertResult);

        // Send initial status
        sendWsMessage({
            type: 'verification_started',
            message: 'Starting verification process...',
            claim: claim,
            timestamp: new Date().toISOString()
        });

        // 1. Extract info from claim
        sendWsMessage({
            type: 'status_update',
            message: 'Extracting event information...',
            progress: 20,
            timestamp: new Date().toISOString()
        });

        const extraction = await gemini.extractEventInfo(claim);

        if (!extraction) return res.status(500).json({ error: 'Failed to extract event info' });

        // 2. Build search query
        sendWsMessage({
            type: 'status_update',
            message: 'Building search query...',
            progress: 40,
            timestamp: new Date().toISOString()
        });

        const query = await buildSearchQuery(extraction, claim);

        // 3. Scrape trusted sources
        sendWsMessage({
            type: 'status_update',
            message: 'Searching for fact-checking sources...',
            progress: 60,
            timestamp: new Date().toISOString()
        });

        const scrapedResults = await searchAndScrape(query);
        console.log('scrapedResults', scrapedResults);

        // 4. Verify with Gemini
        sendWsMessage({
            type: 'status_update',
            message: 'Analyzing evidence with AI...',
            progress: 80,
            timestamp: new Date().toISOString()
        });

        const verification = await gemini.verifyClaimWithEvidence(claim, scrapedResults, bertResult);

        // 5. Save to MongoDB with user email
        sendWsMessage({
            type: 'status_update',
            message: 'Saving results...',
            progress: 90,
            timestamp: new Date().toISOString()
        });

        const savedEvent = await VerificationEvent.create({
            claim,
            extraction,
            evidence: scrapedResults,
            verification,
            userEmail: req.user.email
        });

        // Send completion message
        sendWsMessage({
            type: 'verification_complete',
            message: 'Verification complete!',
            progress: 100,
            timestamp: new Date().toISOString()
        });

        sendWsMessage({
            type: 'status_update',
            message: 'Verification complete!',
            progress: 100,
            timestamp: new Date().toISOString()
        });

        res.json({
            claim,
            extraction,
            evidence: scrapedResults,
            verification,
            bertResult,
            id: savedEvent._id
        });
    } catch (err) {
        sendWsMessage({
            type: 'error',
            message: 'Verification failed: ' + err.message,
            timestamp: new Date().toISOString()
        });
        next(err);
    }
});

// Add GET /logs endpoint to fetch verification events for the authenticated user
router.get('/logs', authenticateToken, async (req, res, next) => {
    try {
        const events = await VerificationEvent.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
        res.json(events);
    } catch (err) {
        next(err);
    }
});

module.exports = { router, setWsClients }; 