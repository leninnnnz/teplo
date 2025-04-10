const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    file: { type: Buffer, required: true }, // Бинарные данные файла
    contentType: { type: String, required: true }, // MIME-тип (например, application/pdf)
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', DocumentSchema);
