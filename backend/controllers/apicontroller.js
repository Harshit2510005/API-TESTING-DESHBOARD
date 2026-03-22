const ApiLog = require('../models/Apilog');
const axios = require('axios');

// API टेस्ट करने का फंक्शन
exports.testApi = async (req, res) => {
    // ... आपका पिछला कोड ...
};

// हिस्ट्री लाने का फंक्शन (यह मौजूद होना चाहिए)
exports.getHistory = async (req, res) => {
    try {
        const logs = await ApiLog.find({ user: req.user.id }).sort({ date: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};