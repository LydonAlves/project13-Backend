const VideoExercise = require("../models/videoExercise")

const getVideoExerciseByID = async (req, res, next) => {
  try {
    const { id } = req.params
    const videoExercise = await VideoExercise.findById(id)
    return res.status(200).json(videoExercise)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const getVideoExerciseByUserID = async (req, res, next) => {
  const { userId } = req.params
  console.log("working");
  try {
    const videoExercise = await VideoExercise.find({ createdBy: userId });
    res.status(200).json(videoExercise);
  } catch (error) {
    console.error('Error fetching videoExercise:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

const getAllVideoExercise = async (req, res, next) => {
  try {
    const videoExercise = await VideoExercise.find()
    return res.status(200).json(videoExercise)
  } catch (error) {
    return res.status(400).json(error)
  }
}


const postVideoExercise = async (req, res, next) => {
  console.log(req.body);
  try {
    const newVideoExercise = new VideoExercise(req.body)
    const videoExercise = await newVideoExercise.save()

    return res.status(201).json(videoExercise)
  } catch (error) {
    console.error('Error in postVideoExercise:', error)
    return res.status(400).json(error)
  }
}

const deleteVideoExercise = async (req, res, next) => {
  try {
    const { id } = req.params
    const videoExerciseDeleted = await VideoExercise.findByIdAndDelete(id)

    return res.status(200).json(videoExerciseDeleted)
  } catch (error) {
    return res.status(400).json('Error in the request')
  }
}


module.exports = {
  getVideoExerciseByID,
  getVideoExerciseByUserID,
  getAllVideoExercise,
  postVideoExercise,
  deleteVideoExercise
}