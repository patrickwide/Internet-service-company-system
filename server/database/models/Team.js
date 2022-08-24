const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: [ 'Installation' ,'Shiffting' , 'Error' ],
    },
    technicians: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Technician',
    }],
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Ticket',
    },
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);