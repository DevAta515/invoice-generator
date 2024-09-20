const mongo = require('mongoose');
const invoiceSchema = new mongo.Schema({
    invoiceNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    totalamount: { type: Number, required: true },
    gstamount: { type: Number, required: true },
    baseamount: { type: Number, required: true },
    gstNo: { type: String, required: true },
    email: { type: String }
});
const Invoice = mongo.model('invoices', invoiceSchema);
module.exports = Invoice;

