const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account',
    },
    category: {
        type: String,
        required: true,
        enum: [ 'Installation' ,'Shiffting' , 'Error' ],
    },
    client_available_date: {
        type: String,
        required: true,
    },
    client_available_time: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: false,
        enum: [ 'Queuing' ,'Canceled' ,'Pending' ,'Done' ],
        default: 'Queuing',
    },
    note: {
        type: String,
        required: false,
    },
    // the assigned technician
    technician_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Technician',
    },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema)