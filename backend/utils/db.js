const mongoose = require('mongoose');
const dns = require('dns');

// Some networks' DNS servers return malformed SRV responses that Node's
// resolver (c-ares) rejects with EBADRESP even though the OS resolver
// handles them fine. Forcing Google's DNS avoids the bad SRV lookup.
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        console.warn('Server will continue without MongoDB — some features may not work');
    }
};

module.exports = connectDB; 