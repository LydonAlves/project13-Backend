const { postSpeakingCorrection, getSpeakingCorrectionByUserID } = require('../controllers/speakingCorrection')

const speakingCorrectionRouter = require('express').Router()

speakingCorrectionRouter.get('/by-userId/:userId', getSpeakingCorrectionByUserID)
speakingCorrectionRouter.post('/', postSpeakingCorrection)

module.exports = speakingCorrectionRouter 