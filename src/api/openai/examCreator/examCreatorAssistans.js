require('dotenv').config();

const { default: OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const taskCreatorAssitant = process.env.OPENAI_TASK_CREATOR_ASSISTANT


const createExam = async (req, res, next) => {
  const assistant = await openai.beta.assistants.retrieve(taskCreatorAssitant)
  const thread = await openai.beta.threads.create();

  const { content } = req.body
  const modifiedContent = `${content}. json`;

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
      console.log(`Run status: ${runStatus.status}`);

      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }


    if (runStatus.status === "completed") {
      let messages = await openai.beta.threads.messages.list(threadId);
      return messages.data.map(msg => msg.content[0].text.value);
    } else {
      console.log("Run is not completed yet.");
    }
  };


  const assistantResponse = await checkStatusAndPrintMessages(thread.id, run.id)

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
  const jsonString = cleanJSONString(assistantResponse[0])
  const jsonObject = JSON.parse(jsonString);
  console.log(JSON.stringify(jsonObject, null, 2));

  return res.status(200).json(jsonObject)

}

module.exports = {
  createExam
}