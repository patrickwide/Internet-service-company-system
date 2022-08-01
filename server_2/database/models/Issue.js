const mongoose = require("mongoose");

const SENDER = {
    CLIENT :'Client',
    AGENT :'Agent',
    TECHNICIAN :'Technician',
    ADMIN :'Admin',
};

const IssueSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'sender_model',
    },
    sender_model: {
        type: String,
        required: true,
        enum: [ SENDER.CLIENT , SENDER.AGENT ,SENDER.TECHNICIAN ,SENDER.ADMIN ]
    },
    status: {
        type: String,
        enum: [ 'Open', 'Closed' ],
        default: 'Open',
    },
    issue_body: {
        type: String,
        required: false,
    },
},{ timestamps: true });

module.exports = mongoose.model('Issue', IssueSchema);