const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    username: String,
    message: String,
    group: String,
    time: String,
})

module.exports = mongoose.model('Message', messageSchema)
