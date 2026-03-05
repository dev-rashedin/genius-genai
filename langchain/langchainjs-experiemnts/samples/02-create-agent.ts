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

console.log(
  await agent.invoke({
    messages: [{ role: "user", content: "Make me laugh with cats" }],
  })
);
