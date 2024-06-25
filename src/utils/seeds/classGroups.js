const fs = require('fs');
const path = require('path');
const ClassGroups = require('../../api/models/classGroup');
const { launchSeed } = require('../seedFunction');

const convertCSVtoArray = (callback) => {
  const filePath = path.join(__dirname, '..', '..', 'data', 'classGroups.csv');
  const classGroupsArray = [];

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    const array = data.split(/\r\n|\r|\n/);
    const keys = array[0].split(",");
    array.shift();

    let currentClassGroup = null

    for (const element of array) {
      if (!element) continue;
      const arrayValues = element.split(',');
      const row = {};

      for (let i = 0; i < arrayValues.length; i++) {
        const value = arrayValues[i];
        const key = keys[i];
        row[key] = value;
      }

      if (currentClassGroup) {
        classGroupsArray.push(currentClassGroup)
      }

      currentClassGroup = {
        id: row.id,
        name: row.name,
        selected: row.selected,
        createdBy: row.createdBy,
        _id: row._id
      }
    }

    if (currentClassGroup) {
      classGroupsArray.push(currentClassGroup)
    }

    callback(null, classGroupsArray);
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

launchSeed(convertCSVtoArrayAsync, ClassGroups, "Class groups");
