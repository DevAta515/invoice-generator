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
    totalamount: zod.number(),
    gstamount: zod.number(),
    baseamount: zod.number(),
    gstNo: zod.string().min(15),
    email: zod.string().email().optional(),
})

router.post("/add", async (req, res) => {
    try {
        const body = req.body;

        // Validate the request body using Zod schema
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


router.get("/get", async (req, res) => {
    try {
        const body = req.body;
        const key = Object.keys(body)[0];  // Extract the first key
        const value = Object.values(body)[0];  // Extract the corresponding value

        let data;

        // Check the key and perform the corresponding database query
        if (key === "name") {
            data = await Client.findOne({ name: value });  // Search in Client by name
        } else {
            data = await Invoice.find({ date: value });  // Search in Invoice by date
        }

        // If no data is found, return a 404 response
        if (!data) {
            return res.status(404).json({
                success: false,
                msg: "Not found"
            });
        }

        // Return the found data with success message
        data = (key == "name") ? data.invoices : data
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
        if (changes.baseamount) {
            const baseamount = changes.baseamount; // Declare the baseamount variable
            const gstamount = (18 * baseamount) / 100; // Declare and calculate gstamount
            const totalamount = baseamount + gstamount; // Declare and calculate totalamount
            changes.gstamount = gstamount; // Update changes object with calculated gstamount
            changes.totalamount = totalamount; // Update changes object with calculated totalamount
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

