const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    },
    status: {
        type: String,
        enum: [ 'Open', 'Closed' ],
        default: 'Open',
    },
    issue_body: {
        type: String,
    },
},{ timestamps: true });

module.exports = mongoose.model('Issue', IssueSchema);