import readline from "node:readline/promises";

import { createAgent, humanInTheLoopMiddleware } from "langchain";
import { ChatGroq } from "@langchain/groq"
import { MemorySaver, Command } from "@langchain/langgraph";
import { getEmails, refund } from "./tools.js";
import {marked} from 'marked'
import TerminalRenderer from 'marked-terminal';

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

  let interrupts = [];

  while(true){

  const query = await rl.question("You: ");

  if(query === '/bye') break;

    const response = await agent.invoke(
      interrupts.length
        ? new Command({
            resume: {
              [interrupts?.[0]?.id]: {
                decisions: [{ type: query === '1' ? 'approve' : 'reject' }],
              },
            },
          })
        : {
            messages: [
              {
                role: 'user',
                content: query,
              },
            ],
          },
      { configurable: { thread_id: '1' } }
    );

interrupts = [];

  const formatted = marked.setOptions({
      renderer: new TerminalRenderer(),
    });

let output = ""
if(response?.__interrupt__?.length){
  interrupts.push(response.__interrupt__[0])

  output += response.__interrupt__[0].value.actionRequests[0].description + "\n\n";

  output += 'Choose:\n';

 output += response.__interrupt__[0].value.reviewConfigs[0].allowedDecisions
        .filter((decision) => decision !== 'edit')
        .map((decision, idx) => `${idx + 1}. ${decision}`)
        .join('\n');
} else {
  output += response.messages[response.messages.length - 1].content;
}

console.log(formatted(output));
  }

  rl.close();
}

main()



