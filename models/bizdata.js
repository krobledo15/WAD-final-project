const mongoose = require('mongoose')
const bizdataSchema = mongoose.Schema({
    countryCode: {
        type: String,
        required: true
    },
    customerID: {
        type: String,
        required: true
    },
    PaperlessData: {
        type: String,
        required: true
    },
    InvoiceNumber: {
        type: String,
        required: true
    },
    InvoiceDate: {
        type: String,
        required: true
    },
    DueDate: {
        type: String,
        required: true
    },
    Disputed: {
        type: String,
        required: true
    },
    SettleDate: {
        type: String,
        required: true
    },
    PayperlessBill: {
        type: String,
        required: true
    },
    DaysToSettle: {
        type: String,
        required: true
    },
    DaysLate: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('bizdata', bizdataSchema)