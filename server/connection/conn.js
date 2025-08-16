const mongoose = require('mongoose');


const conn = async() => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log("MongoDB connected successfully");


        mongoose.connection.on('connected', () => {
            console.log('Mongoose default connection open');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose default connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose default connection disconnected');
        });

    } catch (error) {
        console.error(" MongoDB connection failed:", error.message);
        console.error("URI used:", process.env.MONGO_URI || 'Not found');
        process.exit(1);
    }
};


conn();

module.exports = conn;