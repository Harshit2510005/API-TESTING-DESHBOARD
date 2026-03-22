const mongoose = require('mongoose');
const ApiLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    url: String,
    method: String,
    status: Number,
    responseTime: Number,
    date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ApiLog', ApiLogSchema);