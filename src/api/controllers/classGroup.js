const ClassGroups = require("../models/classGroup")

const getClassGroupsID = async (req, res, next) => {
  try {
    const { id } = req.params
    const classGroup = await ClassGroups.findById(id)
    return res.status(200).json(classGroup)
  } catch (error) {
    return res.status(400).json(error)
  }
}


const getClassGroupsByUserID = async (req, res, next) => {
  const { userId } = req.params
  try {
    const activities = await ClassGroups.find({ createdBy: userId });
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

const getAllClassGroups = async (req, res, next) => {
  try {
    const classGroup = await ClassGroups.find()
    return res.status(200).json(classGroup)
  } catch (error) {
    return res.status(400).json(error)
  }
}


const postClassGroups = async (req, res, next) => {
  try {
    const newClassGroups = new ClassGroups(req.body)
    const classGroup = await newClassGroups.save()

    return res.status(201).json(classGroup)
  } catch (error) {
    console.error('Error in postClassGroups:', error)
    return res.status(400).json(error)
  }
}


const deleteClassGroup = async (req, res, next) => {
  const { id } = req.params
  try {
    const deletedClassGroup = await ClassGroups.findByIdAndDelete(id);

    if (!deletedClassGroup) {
      return res.status(404).json({ message: `Class group with ID ${id} not found.` });
    }

    res.status(200).json({ message: `Class group with ID ${id} successfully deleted.` });
  } catch (error) {
    console.error(`Failed to delete class group with ID ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete class group.' });
  }
}

module.exports = {
  getClassGroupsID,
  getClassGroupsByUserID,
  getAllClassGroups,
  postClassGroups,
  deleteClassGroup
}