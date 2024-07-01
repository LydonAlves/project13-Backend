const mongoose = require("mongoose");

const activityObj = new mongoose.Schema(
  {
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassActivity', required: false },
    title: { type: String, required: false },
  }, { _id: false }
)


const updatedClass = new mongoose.Schema(
  {
    activityObj: { type: activityObj, required: false },
    name: { type: String },
    _id: { type: String },
    selected: { type: Boolean },
  }
)


const classesWithActivitySchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    classes: [updatedClass],
    date: { type: Date, required: true },
    createdBy: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: "classesWithActivitys"
  }
)


const ClassWithActivities = mongoose.model("classesWithActivitys", classesWithActivitySchema, "classesWithActivitys")
module.exports = ClassWithActivities



