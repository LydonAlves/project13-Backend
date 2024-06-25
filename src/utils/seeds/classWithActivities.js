const fs = require('fs');
const path = require('path');
const ClassWithActivities = require('../../api/models/classActivityAssignedDay');
const { launchSeed } = require('../seedFunction');

const convertCSVtoArray = (callback) => {
  const filePath = path.join(__dirname, '..', '..', 'data', 'classWithActivities.csv');
  const classWActArray = [];

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    const array = data.split(/\r\n|\r|\n/);
    const keys = array[0].split(",");
    array.shift();

    let currentClassWAct = null

    for (const element of array) {
      if (!element) continue;
      const arrayValues = element.split(',');
      const row = {};

      for (let i = 0; i < arrayValues.length; i++) {
        const value = arrayValues[i];
        const key = keys[i];
        row[key] = value;
      }

      if (row._id && row.createdBy) {
        if (currentClassWAct) {
          classWActArray.push(currentClassWAct);
        }

        currentClassWAct = {
          _id: row._id,
          classes: [],
          date: row.date,
          createdBy: row.createdBy
        }
      } else {
        if (currentClassWAct) {
          currentClassWAct.classes.push({
            activityObj: {
              activityId: row.activity_id,
              title: row.activity_title
            },
            name: row.classes_name,
            selected: row.classes_selected,
            _id: row.classes_id
          })
        }
      }

    }

    if (currentClassWAct) {
      classWActArray.push(currentClassWAct)
    }

    callback(null, classWActArray);
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

launchSeed(convertCSVtoArrayAsync, ClassWithActivities, "Class with activities")