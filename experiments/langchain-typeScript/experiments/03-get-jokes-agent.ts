import * as z from "zod";
import { createAgent, tool } from "langchain";
import "dotenv/config";


const getJokes = tool(
  async ({keyword}: {keyword: string}) => {
    const result = await fetch(`https://api.chucknorris.io/jokes/search?query=${keyword}`);
    return result.json()
  },
  {
    name: "get_jokes",
     description: "Search for Chuck Norris jokes based on a keyword.",
    schema: z.object({
      keyword: z.string(),
    }),
  }
);

const systemPrompt = "You're a humor assistant that use available tool to provide a joke based on user query."

const responseFormat = z.object({
  joke: z.string(),
})

const agent = createAgent({
  model: "openai:gpt-4o-mini",
  tools: [getJokes],
  systemPrompt,
  responseFormat
})


const agent_invocation = await agent.invoke({
  messages: [
    {role: "user", content: "Tell me a joke about programmers"}
  ]
})

console.log(agent_invocation.structuredResponse)
