import * as z from "zod";
import { createAgent, tool } from "langchain";
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

const agent = createAgent({
  model: "azure_openai:gpt-5-mini",
  tools: [getJokes],
  systemPrompt: "You're a humor assistant that use available tool to provide a joke based on user query.",
});

const events = await agent.stream(
  { messages: [{ role: "user", content: "Make me laugh with cats" }] },
  { streamMode: ['updates'] }
);

for await (const [type, event] of events) {
  // console.log(type);
  // console.log(event);

  if (event.model_request) {
    console.log("\nModel:", event.model_request.messages[0]?.content || event.model_request.messages[0]?.tool_calls[0]);
  } else if (event.tools) {
    console.log(`\nTool: ${event.tools.messages[0].name} response received`);
  }
}
