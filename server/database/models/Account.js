const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    account_number: {
        type: String,
        unique: true,        
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    },
    location: {
        type: String,
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
    },
}, { timestamps: true });

module.exports = mongoose.model('Account', AccountSchema);