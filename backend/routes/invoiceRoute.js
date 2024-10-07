const express = require("express");
const router = express.Router();
const zod = require("zod");
const Invoice = require("../models/invoiceModel")
const Client = require("../models/clientModel")

const itemSchema = zod.object({
    description: zod.string(),
    baseAmount: zod.number(),
    gstAmount: zod.number(),
    totalAmount: zod.number()
});

// Define invoice schema with reference to user and array of items
const invoiceSchema = zod.object({
    invoiceNo: zod.string().startsWith("PT").length(8),
    name: zod.string(),
    address: zod.string(),
    phone: zod.string().optional(),
    date: zod.string(),
    gstNo: zod.string().min(15),
    email: zod.string().optional(),
    items: zod.array(itemSchema)
});
const clientSchema = zod.object({
    name: zod.string(),
    address: zod.string(),
    phone: zod.string().optional(),
    gstNo: zod.string().length(15),
    email: zod.string().optional(),
})

router.post("/add", async (req, res) => {
    try {
        const body = req.body;
        const { name, address, phone, gstNo, email, items } = req.body;
        const clientBody = { name, address, phone, gstNo, email };
        console.log(clientBody)
        console.log(items)
        const { success, error } = invoiceSchema.safeParse(body);
        if (!success) {
            return res.status(400).json({
                success: false,
                msg: "Enter correct invoice details",
                error: error.errors
            });
        }
        let newClient = await Client.findOne({ gstNo: body.gstNo });
        if (!newClient) {
            newClient = new Client(clientBody);
            await newClient.save();
        }

        const invoice = new Invoice(body);
        await invoice.save();
        console.log("here")
        newClient.invoices.push(invoice._id);
        await newClient.save();

        return res.status(201).json({
            success: true,
            msg: "Invoice stored and added to the client successfully",
            data: invoice
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "An error occurred while storing the invoice"
        });
    }
});


router.post("/get", async (req, res) => {
    try {
        const body = req.body;
        console.log(body);
        const key = body.option  // Extract the first key (either 'name' or 'date')
        const value = body.input  // Extract the corresponding value
        console.log(key, value);
        console.log(typeof (value));

        let data;

        // Check the key and perform the corresponding database query
        if (key === "name") {
            console.log("Inside")
            data = await Invoice.find({ name: value });  // Search all invoices by client's name
        } else if (key === "date") {
            data = await Invoice.find({ date: value });  // Search all invoices by date
        } else {
            return res.status(400).json({
                success: false,
                msg: "Invalid key. Please provide either 'name' or 'date'."
            });
        }
        console.log(data);
        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "Not found"
            });
        }

        console.log(data);
        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
});


router.put("/update", async (req, res) => {
    try {
        console.log(req.body);
        const body = req.body;
        const invoiceNo = body.invoiceNo;


        const updatedInvoice = await Invoice.findOneAndUpdate(
            { invoiceNo },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }


        return res.status(200).json({ success: true, updatedInvoice });
    } catch (error) {
        console.error('Error updating invoice:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;

