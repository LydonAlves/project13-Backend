const { getClassGroupsID, getAllClassGroups, postClassGroups, deleteClassGroup, getClassGroupsByUserID } = require('../controllers/classGroup')

const classGroupRouter = require('express').Router()

classGroupRouter.get('/:id', getClassGroupsID)
classGroupRouter.get('/by-userId/:userId', getClassGroupsByUserID)
classGroupRouter.get('/', getAllClassGroups)
classGroupRouter.post('/', postClassGroups)
classGroupRouter.delete('/:id', deleteClassGroup)


module.exports = classGroupRouter 