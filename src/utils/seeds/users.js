const mongoose = require("mongoose");
const fs = require('fs')
const path = require('path');
const User = require("../../api/models/User");
const bcrypt = require('bcrypt');
const { launchSeed } = require("../seedFunction");

const convertCSVtoArray = (callback) => {
  const filePath = path.join(__dirname, '..', '..', 'data', 'users.csv');
  const userArray = []

  fs.readFile(filePath, 'utf-8', (err, data) => {

    const array = data.split(/\r\n|\r|\n/);
    const keys = array[0].split(",")
    array.shift()

    let currentUser = null

    for (const element of array) {
      if (!element) continue;
      let arrayValues = element.split(',')
      const row = {}

      for (let i = 0; i < arrayValues.length; i++) {
        const value = arrayValues[i];
        const key = keys[i];
        row[key] = value;
      }

      if (row._id) {
        if (currentUser) {
          userArray.push(currentUser)
        }
        currentUser = {
          _id: row._id,
          country: row.country,
          email: row.email,
          password: row.password,
          role: row.role,
          userName: row.userName,
          classGroup: row.classGroup
        }
      } else {
        if (currentUser) {
          userArray.push(currentUser)
        }
        currentUser = {
          country: row.country,
          email: row.email,
          password: row.password,
          role: row.role,
          userName: row.userName,
          classGroup: row.classGroup
        }
      }
    }

    if (currentUser) {
      userArray.push(currentUser)
    }

    const hashedUsers = userArray.map(user => {
      user.password = bcrypt.hashSync(user.password, 10);
      return user;
    });

    callback(null, hashedUsers);
  })
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

launchSeed(convertCSVtoArrayAsync, User, "User")

