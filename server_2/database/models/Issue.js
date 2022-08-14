const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: [ 'Open', 'Closed' ],
        default: 'Open',
    },
    body: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Issue', IssueSchema);