const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    message: {type: String, required: true, unique:true},
    date: {type: Date},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    photo_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Photo'}
});

module.exports = mongoose.model('Photo', commentSchema);