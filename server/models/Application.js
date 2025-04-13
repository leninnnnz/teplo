const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    description: { type: String },
    documents: [
        {
            data: { type: Buffer, required: true },
            contentType: { type: String, required: true },
        },
    ],
    status: { type: String, enum: ['В обработке', 'Одобрено', 'Вернулось', 'Завершённый'], default: 'В обработке' },
    comments: [
        {
            text: { type: String, required: true },
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            file: {
                data: Buffer,
                contentType: String,
            },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

applicationSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Application', applicationSchema);
