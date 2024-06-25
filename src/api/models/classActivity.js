const mongoose = require("mongoose")

const activitiesSchema = new mongoose.Schema(
  {
    gapFill: { type: mongoose.Types.ObjectId, ref: 'gapFillTexts', },
    video: { type: mongoose.Types.ObjectId, ref: 'videos', }
  }, { _id: false }
)

const questionsSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
}, { _id: false })

const classActivitySchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    activitiesID: activitiesSchema,
    date: { type: Date, required: true },
    id: { type: String, required: true },
    title: { type: String, required: true },
    questions: [questionsSchema],
    createdBy: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: "classActivities"
  }
)

const ClassActivity = mongoose.model("classActivities", classActivitySchema, "classActivities")
module.exports = ClassActivity


