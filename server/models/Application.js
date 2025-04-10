const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    documents: [
        {
            data: { type: Buffer },
            contentType: { type: String },
        },
    ],
    status: { type: String, default: 'В обработке' },
    comment: { type: String, default: '' }, // Добавляем поле для комментария
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', ApplicationSchema);
