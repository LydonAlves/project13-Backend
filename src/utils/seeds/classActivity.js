const fs = require('fs')
const path = require('path');
const ClassActivity = require("../../api/models/classActivity");
const { launchSeed } = require("../seedFunction");

const convertCSVtoArray = (callback) => {
  const filePath = path.join(__dirname, '..', '..', 'data', 'classActivity.csv');
  const activitiesArray = []

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    const array = data.split(/\r\n|\r|\n/);
    const keys = array[0].split(",");
    array.shift();

    let currentActivity = null

    for (const element of array) {
      if (!element) continue;
      const arrayValues = element.split(',');
      const row = {}

      for (let i = 0; i < arrayValues.length; i++) {
        const value = arrayValues[i];
        const key = keys[i];
        row[key] = value;
      }

      if (row._id && row.activitiesID_gapFill) {
        if (currentActivity) {
          activitiesArray.push(currentActivity)
        }
        currentActivity = {
          _id: row._id,
          activitiesID: {
            gapFill: row.activitiesID_gapFill,
            video: row.activitiesID_video
          },
          date: row.date,
          id: row.id,
          title: row.title,
          questions: [],
          createdBy: row.createdBy
        }
      } else if (row.question_id && row.question_text) {
        if (currentActivity) {
          currentActivity.questions.push({
            id: row.question_id,
            text: row.question_text
          })
        }
      }
    }

    if (currentActivity) {
      activitiesArray.push(currentActivity)
    }

    callback(null, activitiesArray);
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

launchSeed(convertCSVtoArrayAsync, ClassActivity, "Class activity")


