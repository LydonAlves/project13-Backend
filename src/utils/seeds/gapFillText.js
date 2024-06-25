const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const GapFillText = require('../../api/models/gapFillText');

const convertCSVtoArray = (callback) => {
  const filePath = path.join(__dirname, '..', '..', 'data', 'gapFillText.csv');
  const gapFillsArray = [];

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    const array = data.split(/\r\n|\r|\n/);
    const keys = array[0].split(",");
    array.shift();

    let currentGapFill = null;

    for (const element of array) {
      if (!element) continue;
      const arrayValues = element.split(',');
      const row = {};

      for (let i = 0; i < arrayValues.length; i++) {
        const value = arrayValues[i];
        const key = keys[i];
        row[key] = value;
      }

      if (row.dateCreated && row.textObj_text && row.textObj_title && row._id && row.createdBy) {
        if (currentGapFill) {
          gapFillsArray.push(currentGapFill);
        }
        currentGapFill = {
          dateCreated: row.dateCreated,
          textObj: {
            text: row.textObj_text,
            title: row.textObj_title
          },
          answers: [],
          _id: row._id,
          createdBy: row.createdBy
        };
      } else if (row.answer && row.rule_explanation && row.rule_title) {
        if (currentGapFill) {
          currentGapFill.answers.push({
            answer: row.answer,
            rule: {
              explanation: row.rule_explanation,
              title: row.rule_title
            }
          })
        }
      }
    }

    if (currentGapFill) {
      gapFillsArray.push(currentGapFill);
    }

    callback(null, gapFillsArray);
  });
}

const convertCSVtoArrayAsync = () => {
  return new Promise((resolve, reject) => {
    convertCSVtoArray((err, result) => {
      if (err) {
        reject(err);
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

const launchSeed = async () => {
  try {
    const gapFills = await convertCSVtoArrayAsync();
    console.log("gapfills", gapFills);
    await mongoose.connect("mongodb+srv://lydonalves:ubqgd6wnWG0sGdgW@cluster0.ys2pvxm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

    await GapFillText.collection.drop();
    console.log("GapFill collection deleted");

    await GapFillText.insertMany(gapFills);
    console.log("GapFills inserted");

    await mongoose.disconnect();
    console.log("Disconnected from the database");

  } catch (error) {
    console.log("error", error);
  }
}

launchSeed();
