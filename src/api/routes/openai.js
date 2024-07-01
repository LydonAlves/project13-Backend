// const upload = require('../openai/speakingCorrection/uploadFile')
const { uploadAndTranscribe, checkCorrections } = require('../controllers/openai/speakingCorrection/voiceToText')
const upload = require('../controllers/openai/speakingCorrection/uploadFile')
const { createExam, checkExamCreatedProgress } = require('../controllers/openai/examCreator/examCreatorAssistant')

const openaiRouter = require('express').Router()

openaiRouter.post('/uploadTranscribe', upload.single("file"), uploadAndTranscribe)
openaiRouter.get('/request/status/:hash', checkCorrections)
openaiRouter.post('/createExamAi', createExam)
openaiRouter.get('/exam/status/:hash', checkExamCreatedProgress)

module.exports = openaiRouter 
