const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    uri: {type: String, required: true, unique:true},
    description: String,
    date: Date,
    //user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Photo', photoSchema);