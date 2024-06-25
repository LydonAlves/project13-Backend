const mongoose = require("mongoose");

//!I have added rules here, this is to save the rules assigned to the exercise
//! explain this in the README

const rulesInExerciseSchema = new mongoose.Schema(
  {
    explanation: { type: String, required: true },
    title: { type: String, required: true }
  }, { _id: false }
)

const gapFillAnswerSchema = new mongoose.Schema(
  {
    answer: { type: String, required: true },
    rule: { type: rulesInExerciseSchema, required: false }
  },
  { timestamps: true, },
  { _id: false }
)

const textObjSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    title: { type: String, required: true }
  },
  { timestamps: true, }
)

const questionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "questions"
  }
)

module.exports = { gapFillAnswerSchema, textObjSchema, questionSchema };