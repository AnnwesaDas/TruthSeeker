require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { router: verifyEventRouter, setWsClients } = require('./routes/verifyEvent');
const authRouter = require('./routes/auth');
const connectDB = require('./utils/db');
const { WebSocketServer } = require('ws');
const http = require('http');


const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Set();

// Pass WebSocket clients to the router
setWsClients(clients);

// WebSocket connection handling
wss.on('connection', (ws, req) => {
    console.log('New WebSocket client connected');
    console.log('Total clients connected:', clients.size + 1);

    // Add client to the set
    clients.add(ws);

    // Send welcome message
    ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to misinformation verifier',
        timestamp: new Date().toISOString()
    }));

    // Handle incoming messages
    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received message:', data);

            switch (data.type) {
                case 'ping':
                    console.log('Received ping, sending pong');
                    ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
                    break;
                default:
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Unknown message type',
                        timestamp: new Date().toISOString()
                    }));
            }
        } catch (error) { 
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Invalid message format',
                timestamp: new Date().toISOString()
            }));
        }
    });

    // Handle client disconnection
    ws.on('close', (code, reason) => {
        console.log('Client disconnected. Code:', code, 'Reason:', reason);
        clients.delete(ws);
        console.log('Total clients remaining:', clients.size);
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});





// Function to broadcast message to all connected clients
function broadcastMessage(message) {
    const messageStr = JSON.stringify(message);
    clients.forEach(client => {
        if (client.readyState === 1) { // WebSocket.OPEN
            client.send(messageStr);
        }
    });
}

// Function to send message to specific client
function sendToClient(clientId, message) {
    const messageStr = JSON.stringify(message);
    clients.forEach(client => {
        if (client.id === clientId && client.readyState === 1) {
            client.send(messageStr);
        }
    });
}

// Connect to MongoDB
connectDB();

// Rate limiter 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(express.json());
app.use(cors());

app.use('/api/verify-event', verifyEventRouter);
app.use('/api/auth', authRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        websocketConnections: clients.size,
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server ready for connections`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    wss.close(() => {
        console.log('WebSocket server closed');
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(0);
        });
    });
});

module.exports = { broadcastMessage, sendToClient, clients }; 