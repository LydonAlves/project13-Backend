const mongoose = require("mongoose")

const rulesSchema = new mongoose.Schema(
  {
    explanation: { type: String, required: true },
    title: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: "rules"
  }
)

const Rule = mongoose.model("rules", rulesSchema, "rules")
module.exports = Rule
