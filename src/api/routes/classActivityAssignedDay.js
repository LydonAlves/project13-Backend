const { getClassActivityByDate, postClassActivityAssignedByDate, getAllClassActivityByDate, putClassActivityAssignedByDate, removeClassFromActivityByClassID, deleteClassActivityAssignedByDate, getClassWithActivitiesByUserID } = require('../controllers/classActivityAssignedDay')


const classActivityRouterByDate = require('express').Router()

//* Is this used?
classActivityRouterByDate.get('/:date', getClassActivityByDate)


classActivityRouterByDate.get('/by-userId/:userId', getClassWithActivitiesByUserID)
classActivityRouterByDate.get('/', getAllClassActivityByDate)
classActivityRouterByDate.post('/', postClassActivityAssignedByDate)
classActivityRouterByDate.put('/:id', putClassActivityAssignedByDate)
classActivityRouterByDate.put('/removeClass/:id', removeClassFromActivityByClassID)
classActivityRouterByDate.delete('/:id', deleteClassActivityAssignedByDate)

module.exports = classActivityRouterByDate 