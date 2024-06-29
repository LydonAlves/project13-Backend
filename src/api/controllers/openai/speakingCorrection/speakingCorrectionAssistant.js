require('dotenv').config();

const { default: OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const speakingAssistant = process.env.OPENAI_SPEAKING_ASSISTANT

const sendToAssistant = async (transcriptionText) => {
  try {
    const assistant = await openai.beta.assistants.retrieve(speakingAssistant)
    const thread = await openai.beta.threads.create();
    const modifiedText = `${transcriptionText}. json`

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

    function cleanJSONString(inputString) {
      let cleanedString = inputString
        .replace(/\n/g, '')
        .replace(/\\n/g, '')
        .replace(/\\'/g, "'")
        .replace(/\\/g, '')
        .replace(/\s*\+\s*/g, '');
      return cleanedString;
    }

    const jsonString = cleanJSONString(assistantResponse[0])
    const jsonObject = JSON.parse(jsonString);

    console.log("json", jsonObject);

    return { jsonObject };

  } catch (error) {
    console.error('Error communicating with the OpenAI Assistant:', error);
    throw error;
  }
}

module.exports = { sendToAssistant }





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
//     console.log(jsonObject);

//     return { jsonObject };

//   } catch (error) {
//     console.error('Error communicating with the OpenAI Assistant:', error);
//     throw error;
//   }
// }