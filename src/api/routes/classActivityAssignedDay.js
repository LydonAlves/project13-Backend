const { getClassActivityByDate, postClassActivityAssignedByDate, getAllClassActivityByDate, putClassActivityAssignedByDate, removeClassFromActivityByClassID, deleteClassActivityAssignedByDate, getClassWithActivitiesByUserID, getClassActivitiesByClassID } = require('../controllers/classActivityAssignedDay')

const classActivityRouterByDate = require('express').Router()

classActivityRouterByDate.get('/:date', getClassActivityByDate)
classActivityRouterByDate.get('/by-userId/:userId', getClassWithActivitiesByUserID)
classActivityRouterByDate.get('/by-classId/:classId', getClassActivitiesByClassID)
classActivityRouterByDate.get('/', getAllClassActivityByDate)
classActivityRouterByDate.post('/', postClassActivityAssignedByDate)
classActivityRouterByDate.put('/:id', putClassActivityAssignedByDate)
classActivityRouterByDate.put('/removeClass/:id', removeClassFromActivityByClassID)
classActivityRouterByDate.delete('/:id', deleteClassActivityAssignedByDate)

module.exports = classActivityRouterByDate 