let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    email : String,
    password : String,
    name:String,
    phone:String,
    type:String,
    role: { type: String, enum: ['client', 'worker'], default: 'client'},
    uniqueId: { type: String, unique: true }
})

let buyermodel = mongoose.model('useregform', userSchema)

module.exports = buyermodel;