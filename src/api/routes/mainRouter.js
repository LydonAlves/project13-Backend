const classActivityRouter = require('./classActivity')
const classActivityRouterByDate = require('./classActivityAssignedDay')
const classGroupRouter = require('./classGroup')
const gapfillTextRouter = require('./gapfillText')
const openaiRouter = require('./openai')
const ruleRouter = require('./rules')
const speakingCorrectionRouter = require('./speakingCorrection')
const usersRouter = require('./user')
const videoExerciseRouter = require('./videoExercise')

const mainRouter = require('express').Router()

mainRouter.use('/gapfillText', gapfillTextRouter)
mainRouter.use('/videoExercise', videoExerciseRouter)
mainRouter.use('/classActivity', classActivityRouter)
mainRouter.use('/classActivityByDate', classActivityRouterByDate)
mainRouter.use('/classGroup', classGroupRouter)
mainRouter.use('/rules', ruleRouter)
mainRouter.use('/openai', openaiRouter)
mainRouter.use('/speakingCorrection', speakingCorrectionRouter)
mainRouter.use('/user', usersRouter)


module.exports = mainRouter