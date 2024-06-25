const SpeakingCorrection = require("../models/speakingCorrection");

//! not used, should delete
// const getAllSpeakingCorrection = async (req, res, next) => {
//   try {
//     const speakingCorrection = await SpeakingCorrection.find()
//     return res.status(200).json(speakingCorrection)
//   } catch (error) {
//     return res.status(400).json(error)
//   }
// }

const getSpeakingCorrectionByUserID = async (req, res, next) => {
  const { userId } = req.params
  try {
    const speakingCorrection = await SpeakingCorrection.find({ createdBy: userId });
    res.status(200).json(speakingCorrection);
  } catch (error) {
    console.error('Error fetching speakingCorrection:', error);
    res.status(500).json({ error: 'Server error' });
  }
}


const postSpeakingCorrection = async (req, res, next) => {
  try {
    const newSpeakingCorrection = new SpeakingCorrection(req.body)
    const speakingCorrection = await newSpeakingCorrection.save()

    return res.status(201).json(speakingCorrection)
  } catch (error) {
    console.error('Error in postSpeakingCorrection:', error)
    return res.status(400).json(error)
  }
}

module.exports = {
  getSpeakingCorrectionByUserID,
  postSpeakingCorrection
}