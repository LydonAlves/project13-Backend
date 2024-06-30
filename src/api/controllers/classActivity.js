const ClassActivity = require("../models/classActivity")


const getClassActivityByID = async (req, res, next) => {
  try {
    const { id } = req.params
    const classActivity = await ClassActivity.findById(id)
      .populate('activitiesID.gapFill')
      .populate('activitiesID.video')
      .exec();

    return res.status(200).json(classActivity)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const getClassActivityByUserID = async (req, res, next) => {
  const { userId } = req.params
  try {
    const classActivity = await ClassActivity.find({ createdBy: userId })
      .populate('activitiesID.gapFill')
      .populate('activitiesID.video')
      .exec();

    res.status(200).json(classActivity);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

const getClassActivityByUserRole = async (req, res, next) => {
  const { userRole } = req.params
  try {
    const classActivity = await ClassActivity.find({ role: userRole })
      .populate('activitiesID.gapFill')
      .populate('activitiesID.video')
      .exec();

    res.status(200).json(classActivity);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Server error' });
  }
}


const getAllClassActivity = async (req, res, next) => {
  try {
    const classActivity = await ClassActivity.find()
      .populate('activitiesID.gapFill')
      .populate('activitiesID.video')
      .exec();

    return res.status(200).json(classActivity)
  } catch (error) {
    return res.status(400).json(error)
  }
}


const postClassActivity = async (req, res, next) => {
  try {
    const newClassActivity = new ClassActivity(req.body)
    const classActivity = await newClassActivity.save()

    return res.status(201).json(classActivity)
  } catch (error) {
    console.error('Error in postClassActivity:', error)
    return res.status(400).json(error)
  }
}

module.exports = {
  getClassActivityByID,
  getClassActivityByUserID,
  getAllClassActivity,
  getClassActivityByUserRole,
  postClassActivity
}