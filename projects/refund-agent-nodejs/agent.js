import * as z from "zod";
import { createAgent, tool } from "langchain";
import { ChatGroq } from "@langchain/groq"
import { gmailEmails } from "./constants/emails.js";

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
    return JSON.stringify(gmailEmails)
  },
  {
    name: "get_emails",
    description: "Get the emails from inbox",
  },
);

const refund = tool(
  ({emails}) => {
    // todo: access backend apis
      return '✅ All refunds processed succesfully!';
  },
  {
    name: "refund",
    description: "Process the refund for given email",
    schema: z.object({
      emails: z.array(z.string()).describe("The list of the emails which need to be refunded"),
    }),
  },
);


const agent = createAgent({
  model: llm,
  tools: [getEmails, refund],
});

console.log(
  await agent.invoke({
    messages: [{ role: "user", content: "Hey, is there any refund request? I wanted to refund them asap" }],
  })
);