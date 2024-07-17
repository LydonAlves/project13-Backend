require('dotenv').config();
const crypto = require('crypto');
const { default: OpenAI } = require("openai");
const Request = require('../../../models/openaiRequest');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const taskCreatorAssitant = process.env.OPENAI_TASK_CREATOR_ASSISTANT

let examCreatedResponse = ""





const createExam = async (req, res, next) => {

  const { content } = req.body;
  const hash = crypto.randomBytes(16).toString('hex');

  try {
    const existingRequest = await Request.findOne({ hash });

    if (existingRequest) {
      return res.json({ hash, status: existingRequest.status });
    }

    const newRequest = new Request({ hash });

    await newRequest.save();
    res.status(202).json({ hash, status: 'pending' });


    processExamInBackground(content, hash);

    // return res.status(202).json({ status: 'processing', hash });

  } catch (error) {
    console.error('Error in uploadAndTranscribe:', error);
    return res.status(500).json({ message: 'Server error during request initiation.' });
  }
}


const processExamInBackground = async (content, hash) => {
  try {
    const assistant = await openai.beta.assistants.retrieve(taskCreatorAssitant);
    const thread = await openai.beta.threads.create();

    const modifiedContent = `${content}.json`;

    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: modifiedContent,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });




    const checkStatusAndPrintMessages = async (threadId, runId) => {
      let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

      while (runStatus.status === "queued" || runStatus.status === "in_progress") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
      }

      if (runStatus.status === "completed") {
        let messages = await openai.beta.threads.messages.list(threadId);
        return messages.data.map(msg => msg.content[0].text.value);
      } else {
        console.log("Run is not completed yet.");
      }
    };

    const assistantResponse = await checkStatusAndPrintMessages(thread.id, run.id);

    function cleanJSONString(inputString) {
      let cleanedString = inputString
        .replace(/\n/g, '')
        .replace(/\\n/g, '')
        .replace(/\\'/g, "'")
        .replace(/\\/g, '')
        .replace(/\s*\+\s*/g, '');
      return cleanedString;
    }

    console.log("assistant response", assistantResponse);
    const jsonString = cleanJSONString(assistantResponse[0]);
    const jsonObject = JSON.parse(jsonString);
    console.log(JSON.stringify(jsonObject, null, 2));
    examCreatedResponse = jsonObject

    await Request.updateOne({ hash }, { $set: { status: 'completed', content: jsonObject } });

  } catch (error) {
    console.error('Error in processExamInBackground:', error);
    await Request.updateOne({ hash }, { $set: { status: 'error', errorDetails: error.message } });
  }
};


const checkExamCreatedProgress = async (req, res) => {
  const hash = req.params.hash;

  try {
    const requestRecord = await Request.findOne({ hash });
    if (!requestRecord) {
      return res.status(404).json({ message: 'Request record not found.' });
    }

    if (requestRecord.status === 'completed') {
      await Request.deleteOne({ hash });
      return res.status(200).json(examCreatedResponse);
    } else {
      res.json({ status: requestRecord.status, content: requestRecord.content || null });
    }
  } catch (error) {
    console.error('Error retrieving request status:', error);
    res.status(500).json({ message: 'Error processing your request', details: error.message });
  }
};








// const createExam = async (req, res, next) => {
//   const assistant = await openai.beta.assistants.retrieve(taskCreatorAssitant)
//   const thread = await openai.beta.threads.create();

//   const { content } = req.body
//   const modifiedContent = `${content}. json`;

//   const message = await openai.beta.threads.messages.create(thread.id, {
//     role: "user",
//     content: modifiedContent,
//   });

//   const run = await openai.beta.threads.runs.create(thread.id, {
//     assistant_id: assistant.id,
//   });

//   const checkStatusAndPrintMessages = async (threadId, runId) => {
//     let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

//     while (runStatus.status === "queued" || runStatus.status === "in_progress") {
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
//     }

//     if (runStatus.status === "completed") {
//       let messages = await openai.beta.threads.messages.list(threadId);
//       return messages.data.map(msg => msg.content[0].text.value);
//     } else {
//       console.log("Run is not completed yet.");
//     }
//   };

//   const assistantResponse = await checkStatusAndPrintMessages(thread.id, run.id)
//   function cleanJSONString(inputString) {
//     let cleanedString = inputString
//       .replace(/\n/g, '')
//       .replace(/\\n/g, '')
//       .replace(/\\'/g, "'")
//       .replace(/\\/g, '')
//       .replace(/\s*\+\s*/g, '');
//     return cleanedString;
//   }
//   console.log("assistant response", assistantResponse);
//   const jsonString = cleanJSONString(assistantResponse[0])
//   const jsonObject = JSON.parse(jsonString);
//   console.log(JSON.stringify(jsonObject, null, 2));

//   return res.status(200).json(jsonObject)
// }



//! need to incoporate this into the frontend and test


module.exports = {
  createExam,
  checkExamCreatedProgress
} 