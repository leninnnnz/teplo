const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    patronymic: { type: String },
    phone: { type: String },
    verificationCode: { type: String },
    isVerified: { type: Boolean, default: false },
    role: {
        type: String,
        enum: ['admin', 'employee', 'user'],
        default: 'user', // Значение по умолчанию
    },
    createdAt: { type: Date, default: Date.now },
    resetCode: { type: String },
    resetCodeExpires: { type: Date },
});

module.exports = mongoose.model('User', UserSchema);
