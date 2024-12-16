

const mongoose = require('mongoose')

const suspendeAccountSheme = new mongoose.Schema({

    full_name: { type: String, required: true },
    account_type: { type: String, required: true },
    suspension_reason: { type: String, required: true },
    email: { type: String, required: true },
    admin_in_charge: { type: String, required: true },

},
    { timestamps: true }
)


const suspendeAccount = mongoose.model('suspendeaccounts', suspendeAccountSheme)

module.exports = suspendeAccount