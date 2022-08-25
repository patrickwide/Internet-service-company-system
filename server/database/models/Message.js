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
    primary_reply: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'primary_reply_on_model',
    },
    primary_reply_on_model: {
        type: String,
        required: true,
        enum: ['Issue', 'Ticket'],
    },
    secondary_reply: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref:'Message',
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