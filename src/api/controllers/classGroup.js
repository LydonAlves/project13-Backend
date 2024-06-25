const ClassGroups = require("../models/classGroup")

const getClassGroupsID = async (req, res, next) => {
  try {
    const { id } = req.params
    console.log(id);
    const classGroup = await ClassGroups.findById(id)
    return res.status(200).json(classGroup)
  } catch (error) {
    return res.status(400).json(error)
  }
}

//* In use
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

//* In use
const getAllClassGroups = async (req, res, next) => {
  try {
    const classGroup = await ClassGroups.find()
    return res.status(200).json(classGroup)
  } catch (error) {
    return res.status(400).json(error)
  }
}


//* In use
const postClassGroups = async (req, res, next) => {
  // console.log(req.body);
  try {
    const newClassGroups = new ClassGroups(req.body)
    const classGroup = await newClassGroups.save()

    return res.status(201).json(classGroup)
  } catch (error) {
    //? should I remove this error from the different files
    console.error('Error in postClassGroups:', error)
    return res.status(400).json(error)
  }
}

//* In use
const deleteClassGroup = async (req, res, next) => {
  console.log("Delete class group working");
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