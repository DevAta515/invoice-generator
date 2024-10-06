const mongo = require('mongoose');
const itemSchema = new mongo.Schema({
    description: { type: String, required: true },
    baseAmount: { type: Number, required: true },
    gstAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true }
});

// Define the invoice schema
const invoiceSchema = new mongo.Schema({
    invoiceNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    gstNo: { type: String, required: true },
    email: { type: String },
    items: [itemSchema],
});

const Invoice = mongo.model('invoices', invoiceSchema);
module.exports = Invoice;

