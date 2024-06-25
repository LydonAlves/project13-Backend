const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Rule = require('../../api/models/rules');

const convertCSVtoArray = (callback) => {
  const filePath = path.join(__dirname, '..', '..', 'data', 'rules.csv');
  const rulesArray = [];
  const uniqueIds = new Set();

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    const array = data.split(/\r\n|\r|\n/);
    const keys = array[0].split(",");
    array.shift();

    for (const element of array) {
      if (!element) continue;
      const arrayValues = element.split(',');
      const row = {};

      for (let i = 0; i < arrayValues.length; i++) {
        const value = arrayValues[i];
        const key = keys[i];
        row[key] = value;
      }

      if (row.id && row.title && row.explanation) {
        if (uniqueIds.has(row.id)) {
          console.warn(`Duplicate ID detected: ${row.id}. Skipping row.`);
          continue;
        }

        rulesArray.push({
          _id: row.id,
          title: row.title,
          explanation: row.explanation
        });

        uniqueIds.add(row.id);
      } else {
        console.warn(`Missing required fields in row: ${row}`);
      }
    }

    callback(null, rulesArray);
  });
}

const convertCSVtoArrayAsync = () => {
  return new Promise((resolve, reject) => {
    convertCSVtoArray((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const launchSeed = async () => {
  try {
    const rules = await convertCSVtoArrayAsync();
    await mongoose.connect("mongodb+srv://lydonalves:ubqgd6wnWG0sGdgW@cluster0.ys2pvxm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

    await Rule.collection.drop();
    console.log("Rules collection deleted");

    await Rule.insertMany(rules);
    console.log("Rules inserted");

    await mongoose.disconnect();
    console.log("Disconnected from the database");

  } catch (error) {
    console.log("error", error);
  }
}

launchSeed();
