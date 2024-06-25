const { getClassActivityByID, getAllClassActivity, postClassActivity, getClassActivityByUserID, getClassActivityByUserRole } = require('../controllers/classActivity')

const classActivityRouter = require('express').Router()

classActivityRouter.get('/:id', getClassActivityByID)
classActivityRouter.get('/by-userId/:userId', getClassActivityByUserID)
classActivityRouter.get('/', getAllClassActivity)
classActivityRouter.get('/by-userRole/:userId', getClassActivityByUserRole)
classActivityRouter.post('/', postClassActivity)

module.exports = classActivityRouter 