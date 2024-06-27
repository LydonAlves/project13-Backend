require('dotenv').config();

const { default: OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const speakingAssistant = process.env.OPENAI_SPEAKING_ASSISTANT


const assistantHandler = async (req, res) => {
  try {
    const transcriptionText = req.body.transcriptionText;
    const speakingAssistant = req.body.speakingAssistant;

    const intervalId = setInterval(() => {
      res.write('event: keep-alive\n');
      res.write('data: {}\n\n');
    }, 10000);

    const assistant = await openai.beta.assistants.retrieve(speakingAssistant);
    console.log('Assistant retrieved:', assistant);

    const thread = await openai.beta.threads.create();
    console.log('Thread created:', thread);

    const modifiedText = `${transcriptionText}. json`;
    console.log(modifiedText);

    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: modifiedText,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    const checkStatusAndReturnMessages = async (threadId, runId) => {
      let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
      while (runStatus.status === "queued" || runStatus.status === "in_progress") {
        console.log(`Run status: ${runStatus.status}`);

        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      }
      console.log("runStatus", runStatus);

      if (runStatus.status === "completed") {
        let messages = await openai.beta.threads.messages.list(threadId);
        console.log("messages", messages);
        return messages.data.map(msg => msg.content[0].text.value);
      } else {
        console.log("Run is not completed yet.");
      }
    };

    const assistantResponse = await checkStatusAndReturnMessages(thread.id, run.id);
    console.log(assistantResponse);

    function cleanJSONString(inputString) {
      let cleanedString = inputString
        .replace(/\n/g, '')
        .replace(/\\n/g, '')
        .replace(/\\'/g, "'")
        .replace(/\\/g, '')
        .replace(/\s*\+\s*/g, '');
      return cleanedString;
    }

    const jsonString = cleanJSONString(assistantResponse[0]);
    const jsonObject = JSON.parse(jsonString)
    clearInterval(intervalId);
    res.status(200).json({ jsonObject });

  } catch (error) {
    console.error('Error communicating with the OpenAI Assistant:', error);
    clearInterval(intervalId);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// const sendToAssistant = async (transcriptionText) => {
//   try {
//     const assistant = await openai.beta.assistants.retrieve(speakingAssistant)
//     console.log('Assistant retrieved:', assistant);
//     const thread = await openai.beta.threads.create();
//     console.log('Thread created:', thread);
//     const modifiedText = `${transcriptionText}. json`
//     console.log(modifiedText)

//     const message = await openai.beta.threads.messages.create(thread.id, {
//       role: "user",
//       content: modifiedText,
//     });

//     const run = await openai.beta.threads.runs.create(thread.id, {
//       assistant_id: assistant.id,
//     });

//     const checkStatusAndReturnMessages = async (threadId, runId) => {
//       let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
//       while (runStatus.status === "queued" || runStatus.status === "in_progress") {
//         console.log(`Run status: ${runStatus.status}`);

//         await new Promise(resolve => setTimeout(resolve, 1000));
//         runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
//       }
//       console.log("runStatus", runStatus);

//       if (runStatus.status === "completed") {
//         let messages = await openai.beta.threads.messages.list(threadId);
//         console.log("messages", messages);
//         return messages.data.map(msg => msg.content[0].text.value);
//       } else {
//         console.log("Run is not completed yet.");
//       }
//     };

//     const assistantResponse = await checkStatusAndReturnMessages(thread.id, run.id);
//     console.log(assistantResponse);

//     function cleanJSONString(inputString) {
//       let cleanedString = inputString
//         .replace(/\n/g, '')
//         .replace(/\\n/g, '')
//         .replace(/\\'/g, "'")
//         .replace(/\\/g, '')
//         .replace(/\s*\+\s*/g, '');
//       return cleanedString;
//     }

//     const jsonString = cleanJSONString(assistantResponse[0])
//     const jsonObject = JSON.parse(jsonString);

//     return { jsonObject };

//   } catch (error) {
//     console.error('Error communicating with the OpenAI Assistant:', error);
//     throw error;
//   }
// }

module.exports = { assistantHandler }