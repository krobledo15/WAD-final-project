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
    reportname: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    contents: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('data', dataSchema)