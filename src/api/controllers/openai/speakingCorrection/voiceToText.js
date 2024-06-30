const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { sendToAssistant } = require('./speakingCorrectionAssistant');
const Request = require('../../../models/openaiRequest');

let assistantAnswer = ""

const uploadAndTranscribe = async (req, res) => {

  const filePath = path.join(os.tmpdir(), 'uploads', req.file.originalname);
  const hash = crypto.createHash('sha256').update(filePath).digest('hex');

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File not uploaded' });
    }

    const existingRequest = await Request.findOne({ hash });

    if (existingRequest) {
      return res.json({ hash, status: existingRequest.status });
    }

    const newRequest = new Request({ hash, filePath });

    await newRequest.save();
    res.status(202).json({ hash, status: 'pending' });

    processTranscriptionInBackground(filePath, hash);

  } catch (error) {
    console.error('Error in uploadAndTranscribe:', error);
    return res.status(500).json({ message: 'Server error during request initiation.' });
  }
};

async function processTranscriptionInBackground(filePath, hash) {

  const model = "whisper-1";
  const formData = new FormData();
  formData.append("model", model);
  formData.append("file", fs.createReadStream(filePath));

  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const transcription = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`
      }
    });

    const transcriptionText = transcription.data.text;
    const assistantResponse = await sendToAssistant(transcriptionText);

    if (assistantResponse.jsonObject.student_input) {
      assistantAnswer = assistantResponse
      await Request.updateOne({ hash }, { $set: { status: 'completed', content: assistantResponse.jsonObject.student_input } });
    } else {
      throw new Error('No student input found');
    }

  } catch (error) {
    console.error('Error in processTranscriptionInBackground:', error);
    await Request.updateOne({ hash }, { $set: { status: 'error', errorDetails: error.message } });
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting the file:', err);
    });
  }
}


const checkCorrections = async (req, res) => {
  const hash = req.params.hash;
  try {
    const requestRecord = await Request.findOne({ hash });
    if (!requestRecord) {
      return res.status(404).json({ message: 'Request record not found.' });
    }

    if (assistantAnswer) {
      await Request.deleteOne({ hash });
      return res.status(200).json(assistantAnswer)
    } else {
      res.json({ status: requestRecord.status, content: requestRecord.content || null });
    }
  } catch (error) {
    console.error('Error retrieving request status:', error);
    res.status(500).json({ message: 'Error processing your request', details: error.message });
  }
};


// const uploadAndTranscribe = async (req, res, next) => {
//   const filePath = path.join(os.tmpdir(), 'uploads', req.file.originalname);

//   const model = "whisper-1";
//   const formData = new FormData();
//   formData.append("model", model);
//   formData.append("file", fs.createReadStream(filePath));


//   try {
//     console.log('Request body:', req.body);
//     console.log('Uploaded file:', req.file);

//     if (!req.file) {
//       return res.status(400).json({ error: 'File not uploaded' });
//     }
//     const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

//     const transcription = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
//       headers: {
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//         "Content-Type": `multipart/form-data; boundary=${formData._boundary}`
//       }
//     });


//     const transcriptionText = transcription.data.text;
//     console.log("transcriptionText", transcriptionText);



//     //!-------------------------------------------------------------
//     const assistantResponse = await sendToAssistant(transcriptionText, res);
//     console.log("Assistant response", assistantResponse);

//     if (assistantResponse.jsonObject.student_input) {
//       return res.status(201).json(assistantResponse);
//     } else {
//       console.error('No student input found in the assistant response');
//       return res.status(400).json({ error: 'No student input found' });
//     }

//   } catch (error) {
//     console.error('Error in uploadAndTranscribe:', error);
//     return res.status(400).json(error);
//   }
//   finally {
//     fs.unlink(filePath, (err) => {
//       if (err) console.error('Error deleting the file:', err);
//     });
//   }
// };

module.exports = { uploadAndTranscribe, checkCorrections }


