const mongoose = require('mongoose');

let requestSchema = mongoose.Schema({
    id:String,
    userId: String,
    headers: String,
    body: String,
    method: String,
    ip: String
},{ timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Request', requestSchema);