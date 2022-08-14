const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'sender_on_model',
    },
    sender_on_model: {
        type: String,
        required: true,
        enum: ['Client', 'Agent', 'Admin', 'Technician'],
    },
    issue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue',
    },
    reply_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    body: {
        type: String,
        required: true,
    },
    tags: [{
        type: String, // @someone 
        required: false,
        unique: false,
    }],
} ,{ timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);