import { WS_URL } from '../lib/config';

class WebSocketClient {
    constructor(url = WS_URL) {
        this.url = url;
        this.ws = null;
        this.isConnected = false;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.messageHandlers = new Map();
        this.connectionHandlers = [];
        this.disconnectionHandlers = [];
        this.reconnectTimeout = null;
        this.manualDisconnect = false;
    }

    // Reset the client state (useful for page refreshes)
    reset() {
        this.disconnect();
        this.messageHandlers.clear();
        this.connectionHandlers = [];
        this.disconnectionHandlers = [];
        this.manualDisconnect = false;
        this.reconnectAttempts = 0;
    }

    // Connect to WebSocket server
    connect() {
        return new Promise((resolve, reject) => {
            // Prevent multiple simultaneous connection attempts
            if (this.isConnecting || this.isConnected) {
                resolve();
                return;
            }

            this.isConnecting = true;
            this.manualDisconnect = false;

            try {
                this.ws = new WebSocket(this.url);

                this.ws.onopen = () => {
                    console.log('WebSocket connected');
                    this.isConnected = true;
                    this.isConnecting = false;
                    this.reconnectAttempts = 0;
                    this.connectionHandlers.forEach(handler => handler());
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        console.log('WebSocket message received:', data);

                        // Handle different message types
                        if (this.messageHandlers.has(data.type)) {
                            this.messageHandlers.get(data.type).forEach(handler => handler(data));
                        }
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                };

                this.ws.onclose = (event) => {
                    console.log('WebSocket disconnected:', event.code, event.reason);
                    this.isConnected = false;
                    this.isConnecting = false;
                    this.disconnectionHandlers.forEach(handler => handler());

                    // Only attempt to reconnect if it wasn't a manual disconnect
                    if (!this.manualDisconnect && event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.scheduleReconnect();
                    }
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.isConnecting = false;
                    reject(error);
                };

            } catch (error) {
                console.error('Error creating WebSocket connection:', error);
                this.isConnecting = false;
                reject(error);
            }
        });
    }

    // Schedule reconnection with exponential backoff
    scheduleReconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        console.log(`Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);

        this.reconnectTimeout = setTimeout(() => {
            if (!this.manualDisconnect) {
                this.connect().catch(err => {
                    console.error('Reconnection failed:', err);
                });
            }
        }, delay);
    }

    // Disconnect from WebSocket server
    disconnect() {
        this.manualDisconnect = true;
        this.isConnecting = false;

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.ws) {
            this.ws.close(1000, 'Client disconnecting');
            this.ws = null;
        }

        this.isConnected = false;
        this.reconnectAttempts = 0;
    }

    // Send message to server
    send(message) {
        if (this.isConnected && this.ws && this.ws.readyState === 1) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
            throw new Error('WebSocket is not connected');
        }
    }

    // Verify a claim
    verifyClaim(claim, userId = null, token = null) {
        this.send({
            type: 'verify_claim',
            claim: claim,
            userId: userId,
            token: token,
            timestamp: new Date().toISOString()
        });
    }

    // Send ping to keep connection alive
    ping() {
        this.send({
            type: 'ping',
            timestamp: new Date().toISOString()
        });
    }

    // Register message handlers
    onMessage(type, handler) {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, []);
        }
        this.messageHandlers.get(type).push(handler);
    }

    // Register connection handlers
    onConnect(handler) {
        this.connectionHandlers.push(handler);
    }

    // Register disconnection handlers
    onDisconnect(handler) {
        this.disconnectionHandlers.push(handler);
    }

    // Remove message handler
    offMessage(type, handler) {
        if (this.messageHandlers.has(type)) {
            const handlers = this.messageHandlers.get(type);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    // Get connection status
    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            isConnecting: this.isConnecting,
            reconnectAttempts: this.reconnectAttempts,
            maxReconnectAttempts: this.maxReconnectAttempts,
            manualDisconnect: this.manualDisconnect
        };
    }
}

// Create a singleton instance
const websocketClient = new WebSocketClient();

export default websocketClient; 