let mongoose = require('mongoose');

let workerSchema = mongoose.Schema({
    email: String,
    password: String,
    name: String,
    uniqueId: { type: String, unique: true },
    phone: Number,
    books: [{
        title: String,
        author: String,
        price: Number,
        category: String,
        book_images: [{ 
            filename: { type: String },
            contentType: { type: String },
            uploadDate: { type: Date },
            metadata: { type: Object }
        }],
        condition: String
    }],
    role: { type: String, enum: ['client', 'worker'], default: 'worker' }
});

let sellermodel = mongoose.model('workeregform', workerSchema);

module.exports = sellermodel;
