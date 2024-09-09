const mongoose = require("mongoose");
const connection = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://220104021:2LCbItzP3FEvS5q9@cluster0.l7f8eqy.mongodb.net/invoice-generator"
        )
        console.log("Database connected")
    } catch (error) {
        console.log("Error in connecting DB", error);
    }
}

module.exports = {
    connection
}