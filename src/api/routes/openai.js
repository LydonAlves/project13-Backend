// const upload = require('../openai/speakingCorrection/uploadFile')
const { uploadAndTranscribe, checkCorrections } = require('../controllers/openai/speakingCorrection/voiceToText')
const { createExam } = require('../controllers/openai/examCreator/examCreatorAssistans')
const upload = require('../controllers/openai/speakingCorrection/uploadFile')



const openaiRouter = require('express').Router()

openaiRouter.post('/uploadTranscribe', upload.single("file"), uploadAndTranscribe)
openaiRouter.get('/request/status/:hash', checkCorrections)
openaiRouter.post('/createExamAi', createExam)

module.exports = openaiRouter 
