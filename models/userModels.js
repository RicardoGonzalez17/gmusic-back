const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Write your name"]
    },
    email: {
        type: String,
        required: [true, "Write your email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Write your password"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    library: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song'
        }
    ]
},
{
    timestamps: true    
})

module.exports = mongoose.model('User', userSchema)