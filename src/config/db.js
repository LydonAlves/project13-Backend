const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log("Connected to the database successfully");
  } catch (error) {
    console.log("Error connecting to the database");

  }
}

module.exports = { connectDB }
