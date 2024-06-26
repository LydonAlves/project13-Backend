const fs = require('fs');
const os = require('os');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { sendToAssistant } = require('./speakingCorrectionAssistant');


const uploadAndTranscribe = async (req, res, next) => {
  // const filePath = path.join(__dirname, 'uploads', req.file.originalname);
  const filePath = path.join(os.tmpdir(), 'uploads', req.file.originalname);

  const model = "whisper-1";
  const formData = new FormData();
  formData.append("model", model);
  formData.append("file", fs.createReadStream(filePath));


  try {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: 'File not uploaded' });
    }
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const transcription = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`
      }
    });


    const transcriptionText = transcription.data.text;
    console.log("transcriptionText", transcriptionText);

    const assistantResponse = await sendToAssistant(transcriptionText);
    console.log("Assistant response", assistantResponse);

    return res.status(201).json(assistantResponse);
  } catch (error) {
    console.error('Error in uploadAndTranscribe:', error);
    return res.status(400).json(error);
  }
  finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting the file:', err);
    });
  }
};

module.exports = { uploadAndTranscribe }


