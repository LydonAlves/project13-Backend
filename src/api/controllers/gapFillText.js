const GapFillText = require("../models/gapFillText");

//*in use
const getGapfillTextByID = async (req, res, next) => {
  try {
    const { id } = req.params
    const gapfillText = await GapFillText.findById(id)
    return res.status(200).json(gapfillText)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const getGapFillByUserID = async (req, res, next) => {
  const { userId } = req.params
  try {
    const gapfillText = await GapFillText.find({ createdBy: userId });
    res.status(200).json(gapfillText);
  } catch (error) {
    console.error('Error fetching gapfillText:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

//*in use
const getAllGapfillText = async (req, res, next) => {
  try {
    const gapfillText = await GapFillText.find()
    return res.status(200).json(gapfillText)
  } catch (error) {
    return res.status(400).json(error)
  }
}

//*in use
const postGapfillText = async (req, res, next) => {
  try {
    const newGapfillText = new GapFillText(req.body)
    const gapfillText = await newGapfillText.save()

    return res.status(201).json(gapfillText)
  } catch (error) {
    console.error('Error in postEvent:', error)
    return res.status(400).json(error)
  }
}

module.exports = {
  getGapfillTextByID,
  getGapFillByUserID,
  getAllGapfillText,
  postGapfillText
}