const mongoose = require('mongoose')
const dataSchema = mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    filetype: {
        type: String,
        required: true
    },
    reportName: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    contents: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('data', dataSchema)