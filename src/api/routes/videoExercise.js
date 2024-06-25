const { getVideoExerciseByID, getAllVideoExercise, postVideoExercise, deleteVideoExercise, getVideoExerciseByUserID } = require('../controllers/videoExercise')


const videoExerciseRouter = require('express').Router()

videoExerciseRouter.get('/:id', getVideoExerciseByID)
videoExerciseRouter.get('/by-userId/:userId', getVideoExerciseByUserID)
videoExerciseRouter.get('/', getAllVideoExercise)
videoExerciseRouter.post('/', postVideoExercise)
videoExerciseRouter.delete('/:id', deleteVideoExercise)

module.exports = videoExerciseRouter 