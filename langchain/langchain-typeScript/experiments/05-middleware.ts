import * as z from "zod";
import { createAgent, tool, humanInTheLoopMiddleware } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import "dotenv/config";


const getJokes = tool(
  async ({ keyword }: { keyword: string }) => {
    const result = await fetch(`https://api.chucknorris.io/jokes/search?query=${keyword}`);
    return result.json();
  },
  {
    name: "get_jokes",
    description: "Search for Chuck Norris jokes based on a keyword.",
    schema: z.object({
      keyword: z.string(),
    }),
  },
);

const checkpointer = new MemorySaver();

const responseFormat = z.object({
  joke: z.string(),
})

const agent = createAgent({
  model: "openai:gpt-4o-mini",
  tools: [getJokes],
  systemPrompt: "You're a humor assistant that use available tool to provide a joke based on user query.",
  
  responseFormat,
  checkpointer,
  middleware: [humanInTheLoopMiddleware({
    interruptOn: {
      // Require approval before calling tool
      get_jokes: {
        allowedDecisions: ["approve", "reject"]
      }
    }
  })],
})


const agent_invocation = await agent.invoke(
  {
    messages: [
      { role: "user", content: "Make me laugh with software development" },
    ],
  },
  {
    configurable: { thread_id: "1" }
  }
);


// console.log(agent_invocation)
console.log(agent_invocation.structuredResponse)
