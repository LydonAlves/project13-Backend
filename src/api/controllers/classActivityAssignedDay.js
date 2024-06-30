const ClassWithActivities = require("../models/classActivityAssignedDay");

const getClassActivityByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const classActivities = await ClassWithActivities.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (classActivities.length === 0) {
      return res.status(404).json({ message: "No class activities found for this date." });
    }

    return res.status(200).json(classActivities);
  } catch (error) {
    console.error("Error finding class activity by date: ", error);
    return res.status(500).json(error);
  }
}

const getClassWithActivitiesByUserID = async (req, res, next) => {
  const { userId } = req.params
  try {
    const classWithActivities = await ClassWithActivities.find({ createdBy: userId });
    res.status(200).json(classWithActivities);
  } catch (error) {
    console.error('Error fetching classWithActivities:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

const getAllClassActivityByDate = async (req, res, next) => {
  try {
    const classWithActivities = await ClassWithActivities.find()
    return res.status(200).json(classWithActivities)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const postClassActivityAssignedByDate = async (req, res, next) => {
  try {
    const newClassWithActivities = new ClassWithActivities(req.body)
    const classActivity = await newClassWithActivities.save()

    return res.status(201).json(classActivity)
  } catch (error) {
    console.error('Error in postClassActivityAssignedByDate:', error)
    return res.status(400).json(error)
  }
}

const putClassActivityAssignedByDate = async (req, res, next) => {
  const { id } = req.params;

  try {
    const updatedClassWithActivities = await ClassWithActivities.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedClassWithActivities) {
      return res.status(404).json({ message: "ClassWithActivities not found" });
    }

    return res.status(200).json(updatedClassWithActivities);
  } catch (error) {
    console.error('Error in putClassActivityAssignedByDate:', error);
    return res.status(400).json(error);
  }
}

const removeClassFromActivityByClassID = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await ClassWithActivities.updateMany(
      { "classes._id": id },
      { $pull: { classes: { _id: id } } }
    )

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: `No documents found with classID ${id}.` });
    }

    return res.status(200).json({ message: `${result.modifiedCount} documents were updated.` });
  } catch (error) {
    console.error('Error in removeClassFromActivityByClassID:', error);
    return res.status(500).json({ error: 'Failed to remove class from activities.' });
  }
}

const deleteClassActivityAssignedByDate = async (req, res, next) => {
  const { id } = req.params
  try {
    const deletedClassActivity = await ClassWithActivities.findByIdAndDelete(id);

    if (!deletedClassActivity) {
      return res.status(404).json({ message: `Class activity with ID ${id} not found.` });
    }

    res.status(200).json({ message: `Class activity with ID ${id} successfully deleted.` });
  } catch (error) {
    console.error(`Failed to delete class activitty with ID ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete class activitt.' });
  }
}

module.exports = {
  getClassActivityByDate,
  getClassWithActivitiesByUserID,
  getAllClassActivityByDate,
  postClassActivityAssignedByDate,
  putClassActivityAssignedByDate,
  removeClassFromActivityByClassID,
  deleteClassActivityAssignedByDate
}