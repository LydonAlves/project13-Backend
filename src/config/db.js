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




//! It looks like I can set up a model and call the fucntion through there to have the db connected
//* Read through chatgpt
//* Read voiceToText