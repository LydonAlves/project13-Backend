const fs = require('fs');
const path = require('path');
const VideoExercise = require('../../api/models/videoExercise');
const { launchSeed } = require('../seedFunction');

const convertCSVtoArray = (callback) => {
  const filePath = path.join(__dirname, '..', '..', 'data', 'videoActivity.csv');
  const videoActivityArray = []

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    // console.log(data);
    const array = data.split(/\r\n|\r|\n/);
    const keys = array[0].split(",");
    array.shift();

    let currectVideoActivity = null

    for (const element of array) {
      if (!element) continue
      const arrayValues = element.split(',')
      const row = {}

      for (let i = 0; i < arrayValues.length; i++) {
        const value = arrayValues[i]
        const key = keys[i]
        row[key] = value
      }
      console.log("row", row);

      if (row._id && row.video_id && row.startTimeSaved) {
        console.log("first row working", row);
        if (currectVideoActivity) {
          videoActivityArray.push(currectVideoActivity)
        }
        currectVideoActivity = {
          _id: row._id,
          answers: [],
          video: {
            chosenTimes: {
              endTimeSaved: row.endTimeSaved,
              startTimeSaved: row.startTimeSaved,
            },
            opts: {
              borderRadius: row.opts_borderRadius,
              height: row.opts_height,
              playerVars: {
                autoplay: row.opts_playerVars_autoplay,
                end: row.opts_playerVars_end,
                start: row.opts_playerVars_start,
              },
              videoId: row.video_id,
              width: row.opts_width
            },
          },
          textObj: {
            text: row.text,
            title: row.text_title
          },
          createdBy: row.createdBy,
          dateCreated: row.dateCreated
        }
      } else if (row.answer && row.explanation && row.rule_title) {
        console.log("other rows working", row);
        if (currectVideoActivity) {
          currectVideoActivity.answers.push({
            answer: row.answer,
            rule: {
              explanation: row.explanation,
              title: row.rule_title
            }
          });
        } else {
          console.warn(`Orphan answer row detected without a preceding dateCreated: ${row}`);
        }
      }
    }

    if (currectVideoActivity) {
      videoActivityArray.push(currectVideoActivity);
    }

    callback(null, videoActivityArray);
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

launchSeed(convertCSVtoArrayAsync, VideoExercise, "VideoActivity");
