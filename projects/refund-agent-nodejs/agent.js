import readline from "node:readline/promises";

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
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  const interrupts = []

  while(true){

    const query = await rl.question("You: ");


  const response = await agent.invoke(
    {
      messages: [
        { role: "user", content: query 
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



}

main()



