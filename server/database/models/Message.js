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
    reply: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'reply_on_model',
    },
    reply_on_model: {
        type: String,
        required: true,
        enum: ['Message', 'Issue', 'Ticket'],
    },
    tags: [{
        type: String, // @username 
        required: false,
        unique: false,
    }],
    body: {
        type: String,
        required: true,
    },
} ,{ timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);