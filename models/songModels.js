const mongoose = require('mongoose')

const songSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: [true, 'Artist is required']
    },
    active: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Song', songSchema);