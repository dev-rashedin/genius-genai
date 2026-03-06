import * as z from "zod";
import { createAgent } from "langchain";
import { ChatGroq } from "@langchain/groq"

const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
})

const getEmails = tool(
  () => {
    // todo: access Gmail apis
    return ""
  },
  {
    name: "get_emails",
    description: "Get the emails from inbox",
  },
);

const agent = createAgent({
  model: "claude-sonnet-4-6",
  tools: [getEmails],
});

console.log(
  await agent.invoke({
    messages: [{ role: "user", content: "What's the weather in Tokyo?" }],
  })
);