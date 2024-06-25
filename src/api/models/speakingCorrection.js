const mongoose = require("mongoose")

const identifiederrorsSchema = new mongoose.Schema(
  {
    correction: { type: String, required: true },
    error: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false }
)

const correctionsSchema = new mongoose.Schema(
  {
    student_input: { type: String, required: true },
    identified_errors: [identifiederrorsSchema]
  },
  { _id: false }
)

const questionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
)

const speakingCorrectionSchema = new mongoose.Schema(
  {
    question: questionSchema,
    corrections: correctionsSchema,
    date: { type: Date, required: true },
    createdBy: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: "speakingResults"
  }
)

const SpeakingCorrection = mongoose.model("speakingCorrection", speakingCorrectionSchema, "speakingCorrection")
module.exports = SpeakingCorrection







//*----------------------------

// let identified_errors = {
//   error: "",
//   correction: "",
//   explanation: ""
// }

// let corrections = {
//   student_input: "",
//   identified_errors: []
// }


// let question = {
//   id: "",
//   text: ""
// }

// let question = {
//   id: "",
//   text: ""
// }

// let speakingResults = {
//   question: {},
//   corrections: [],
//   date: ""
// }