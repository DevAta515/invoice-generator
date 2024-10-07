const express = require("express");
const router = express.Router();
const zod = require("zod");
const Client = require("../models/clientModel")

const clientSchema = zod.object({
    name: zod.string(),
    address: zod.string(),
    phone: zod.string().optional(),
    gstNo: zod.string().length(15),
    email: zod.string().optional(),
})
router.post('/add', async (req, res) => {
    try {
        const body = req.body;
        const { success, error } = clientSchema.safeParse(body);

        if (!success) {
            return res.status(400).json({
                success: false,
                message: "Enter correct details",
                error: error.errors
            });
        }

        const client = await Client.findOne({ gstNo: body.gstNo });

        if (client) {
            return res.status(201).json({
                success: true,
                message: "Client already exists"
            });
        }

        const newClient = new Client(body);
        await newClient.save();  // Don't forget to save the client to the database

        return res.status(201).json({
            success: true,
            message: "Client created"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message // Optionally include the error message for debugging
        });
    }
});

router.get("/get", async (req, res) => {
    try {
        const data = await Client.find({});
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message // Optionally send the error message for debugging
        });
    }
});


module.exports = router