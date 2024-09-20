const mongo = require('mongoose');
const clientSchema = new mongo.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    gstNo: { type: String, required: true, unique: true },
    email: { type: String, required: false },
    invoices: [{
        type: mongo.Schema.Types.ObjectId,
        ref: 'Invoice'
    }]
});
const Client = mongo.model('Client', clientSchema);
module.exports = Client;