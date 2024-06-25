const fs = require('fs');
const path = require('path');
const SpeakingCorrection = require('../../api/models/speakingCorrection');
const { launchSeed } = require('../seedFunction');

const convertCSVtoArray = (callback) => {
  const filePath = path.join(__dirname, '..', '..', 'data', 'correctionsSaved.csv');
  const correctionsArray = [];

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    const array = data.split(/\r\n|\r|\n/);
    const keys = array[0].split(",");
    array.shift();

    let currentCorrection = null;

    for (const element of array) {
      if (!element) continue;
      const arrayValues = element.split(',');
      const row = {};

      for (let i = 0; i < arrayValues.length; i++) {
        const value = arrayValues[i];
        const key = keys[i];
        row[key] = value;
      }

      if (row.date) {
        if (currentCorrection) {
          correctionsArray.push(currentCorrection);
        }
        currentCorrection = {
          date: row.date,
          createdBy: row.createdBy,
          question: {
            text: row.question_text,
            id: row.question_id,
          },
          corrections: {
            student_input: row.student_input,
            identified_errors: []
          }
        };
      } else if (row.error) {
        if (currentCorrection) {
          currentCorrection.corrections.identified_errors.push({
            error: row.error,
            correction: row.correction,
            explanation: row.explanation
          });
        } else {
          console.warn(`Row detected without a preceding date: ${row}`);
        }
      }
    }

    if (currentCorrection) {
      correctionsArray.push(currentCorrection);
    }

    callback(null, correctionsArray);
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

launchSeed(convertCSVtoArrayAsync, SpeakingCorrection, "Speaking correction");
