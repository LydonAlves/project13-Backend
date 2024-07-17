const mongoose = require("mongoose");
const { gapFillAnswerSchema, textObjSchema } = require("./textSchemas");


const playerVarsSchema = new mongoose.Schema(
  {
    autoplay: { type: Number, required: true },
    end: { type: Number, required: false, default: null },
    start: { type: Number, required: false, default: null }
  }, { _id: false }
)

const optsSchema = new mongoose.Schema(
  {
    borderRadius: { type: String, required: true },
    height: { type: String, required: true },
    playerVars: playerVarsSchema,
    videoId: { type: String, required: true },
    width: { type: String, required: true }
  }, { _id: false }
)


const chosenTimesSchema = new mongoose.Schema({
  endTimeSaved: { type: String, required: false, default: null },
  startTimeSaved: { type: String, required: false, default: null }
}, { _id: false }
);


const video = new mongoose.Schema({
  chosenTimes: chosenTimesSchema,
  opts: optsSchema
}, { _id: false }
);


const videoExerciseSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  answers: [gapFillAnswerSchema],
  dateCreated: { type: Date, required: true },
  video: video,
  textObj: textObjSchema,
  createdBy: { type: String, required: true }
}, {
  timestamps: true,
  collection: 'videos'
});

const VideoExercise = mongoose.model("videos", videoExerciseSchema, "videos")
module.exports = VideoExercise
