/**
 * This file is for instantiating the mongoose package to connect
 * our application's server to the MongoDB database. 
 * Our .env file includes the DATABASE name and password
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // connect to mongoDB via DATABASE URI in .env file (local only)
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB