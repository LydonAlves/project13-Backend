const mongoose = require("mongoose")
const { gapFillAnswerSchema, textObjSchema } = require("./textSchemas")

const gapFillTextSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    answers: [gapFillAnswerSchema],
    dateCreated: { type: Date, required: true },
    textObj: textObjSchema,
    createdBy: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: "gapFillTexts"
  }
)

const GapFillText = mongoose.model("gapFillTexts", gapFillTextSchema, "gapFillTexts")
module.exports = GapFillText 