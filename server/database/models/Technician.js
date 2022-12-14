const mongoose = require('mongoose');

const TechnicianSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Technician', TechnicianSchema);