const mongoose = require('mongoose')

const artistSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    image: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Artist', artistSchema)