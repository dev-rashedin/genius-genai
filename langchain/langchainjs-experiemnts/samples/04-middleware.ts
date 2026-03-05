import * as z from "zod";
import { createAgent, tool, humanInTheLoopMiddleware } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import "dotenv/config";

const getJokes = tool(
  async ({ keyword }) => {
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

const agent = createAgent({
  model: "azure_openai:gpt-5-mini",
  tools: [getJokes],
  systemPrompt: "You're a humor assistant that use available tool to provide a joke based on user query.",

  checkpointer,
  middleware: [humanInTheLoopMiddleware({
    interruptOn: {
      // Require approval before calling tool
      get_jokes: {
        allowedDecisions: ["approve", "reject"],
      },
    }
  })],
});

console.log(
  await agent.invoke(
    { messages: [{ role: "user", content: "Make me laugh with cats" }] },
    { configurable: { thread_id: "1" } }
  )
);
