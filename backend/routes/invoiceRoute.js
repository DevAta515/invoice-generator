const express = require("express");
const router = express.Router();
const zod = require("zod");
const Invoice = require("../models/invoiceModel")
const Client = require("../models/clientModel")

const invoiceSchema = zod.object({
    invoiceNo: zod.string().startsWith("PT").length(8),
    name: zod.string(),
    address: zod.string(),
    phone: zod.string(),
    date: zod.string(),
    description: zod.string(),
    totalAmount: zod.number(),
    gstAmount: zod.number(),
    baseAmount: zod.number(),
    gstNo: zod.string().min(15),
    email: zod.string().email().optional(),
})

router.post("/add", async (req, res) => {
    try {
        const body = req.body;
        const { success, error } = invoiceSchema.safeParse(body);
        if (!success) {
            return res.status(400).json({
                success: false,
                msg: "Enter correct details",
                error: error.errors
            });
        }
        const client = await Client.findOne({ gstNo: body.gstNo });
        if (!client) {
            return res.status(404).json({
                success: false,
                msg: "Client not found"
            });
        }

        const invoice = new Invoice(body);
        await invoice.save();
        console.log("here")
        // Add the invoice ID to the client's 'invoices' array
        client.invoices.push(invoice._id);
        await client.save();

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
        // If no data is found, return a 404 response
        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "Not found"
            });
        }

        // Return the found invoice data with a success message
        console.log(data);
        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        // Handle any errors that occur during execution
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
});


router.put("/update", async (req, res) => {
    try {
        const body = req.body;
        const invoiceNo = body.invoiceNo;
        const changes = body.changes;
        if (changes.baseAmount) {
            const baseAmount = changes.baseAmount; // Declare the baseAmount variable
            const gstAmount = (18 * baseAmount) / 100; // Declare and calculate gstAmount
            const totalAmount = baseAmount + gstAmount; // Declare and calculate totalAmount
            changes.gstAmount = gstAmount; // Update changes object with calculated gstAmount
            changes.totalAmount = totalAmount; // Update changes object with calculated totalAmount
        }


        // Find the invoice by invoiceNo and update with the provided changes
        const updatedInvoice = await Invoice.findOneAndUpdate(
            { invoiceNo }, // Make sure to use the correct key, 'invoiceNo'
            { $set: changes }, // Dynamically set the changes from the request body
            { new: true, runValidators: true } // Return the updated document and run validations
        );

        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // If successfully updated, send the updated invoice back
        return res.status(200).json(updatedInvoice);
    } catch (error) {
        // Catch any errors and return a 500 response with the error message
        console.error('Error updating invoice:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;

