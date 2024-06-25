require("dotenv").config()
const mongoose = require('mongoose');

const launchSeed = async (convertCSVtoArrayAsync, Model, seedType) => {
  try {
    const data = await convertCSVtoArrayAsync();
    await mongoose.connect(process.env.DB_URL);

    await Model.collection.drop();
    console.log(`${seedType} collection deleted`);

    await Model.insertMany(data);
    console.log(`${seedType} collection inserted`);

    await mongoose.disconnect();
    console.log("Disconnected from the database");

  } catch (error) {
    console.log("error", error);
  }
}

module.exports = { launchSeed }

