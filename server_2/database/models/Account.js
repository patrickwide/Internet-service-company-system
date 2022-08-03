const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    account_no: {
        type: String,
        unique: true,        
    },
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    },
    location: {
        type: String,
    },
    agent_id: {
        type: String,
        ref: 'Agent',
    },
}, { timestamps: true });

module.exports = mongoose.model('Account', AccountSchema);