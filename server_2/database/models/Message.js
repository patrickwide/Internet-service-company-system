const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'sender_type',
    },
    sender_type: {
        type: String,
        required: true,
        enum: [ 'Client' , 'Agent' ,'Technician' ,'Admin' ]
    },
    issue_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue',
    },
    massage_body: {
        type: String,
        required: true,
    },
} ,{ timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
 