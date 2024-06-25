const mongoose = require("mongoose")

const classGroupSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    selected: { type: Boolean, required: true },
    createdBy: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: "classGroups"
  }
)

const ClassGroups = mongoose.model("classGroups", classGroupSchema, "classGroups")
module.exports = ClassGroups 