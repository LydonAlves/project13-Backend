// const upload = require('../../middlewares/uploadFile')
const upload = require('../openai/speakingCorrection/uploadFile')
const { createExam } = require('../openai/examCreator/examCreatorAssistans')
const { uploadAndTranscribe, checkCorrections } = require('../openai/speakingCorrection/voiceToText')

const openaiRouter = require('express').Router()

openaiRouter.post('/uploadTranscribe', upload.single("file"), uploadAndTranscribe)
openaiRouter.get('/request/status/:hash', checkCorrections)




openaiRouter.post('/createExamAi', createExam)

module.exports = openaiRouter 
