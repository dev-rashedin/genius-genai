import readline from "node:readline/promises";
import * as z from "zod";
import { createAgent, tool, humanInTheLoopMiddleware } from "langchain";
import { ChatGroq } from "@langchain/groq"
import { gmailEmails } from "./constants/emails.js";
import { MemorySaver } from "@langchain/langgraph";

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
  middleware: [
    humanInTheLoopMiddleware({
      interruptOn: { refund: true },
      descriptionPrefix: 'Refund pending approval',
    }),
  ],
  checkpointer: new MemorySaver(),
});

async function main(){
  const interrupts = []

  const response = await agent.invoke(
    {
      messages: [
        { role: "user", content: "Hey, is there any refund   request? I wanted to refund them asap" 
        }
      ],
    },
    {  configurable: { thread_id: "1" }}
)


let output = ""
if(response?.__interrupt__.length){
  interrupts.push(response.__interrupt__[0])

  output += response.__interrupt__[0].value.actionRequests[0].description + "\n\n";

  output += 'Choose:\n';

 output += response.__interrupt__[0].value.reviewConfigs[0].allowedDecisions
        .filter((decision) => decision !== 'edit')
        .map((decision, idx) => `${idx + 1}. ${decision}`)
        .join('\n');
} else {

}

console.log(output);

}

main()



