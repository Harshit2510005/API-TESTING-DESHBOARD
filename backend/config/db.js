const mongoose = require('mongoose');
require('dotenv').config(); // यहां भी dotenv लोड करें ताकि MONGO_URI मिल सके

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("❌ Error: MONGO_URI is not defined in .env file. Please check your .env file.");
        process.exit(1);
    }
    try {
        await mongoose.connect(uri);
        console.log("✅ MongoDB Atlas Connected Successfully!");
    } catch (err) {
        console.error("❌ Database Connection Error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;