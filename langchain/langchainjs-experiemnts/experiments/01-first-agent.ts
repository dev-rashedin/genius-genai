import * as z from "zod";
import {createAgent, tool} from "langchain"
import "dotenv/config"


const getWeather = tool(
  ({city}) => `It's always sunny in ${city}!`,
  {
    name: "get_weather",
    description: "Get the weather for a city",
    schema: z.object({
      city: z.string()
    }),
  } 
)

const agent = createAgent({
  model: "openai:gpt-5-mini",
  tools: [getWeather],
  systemPrompt: "You are a helpful assistant."
})



console.log(
  await agent.invoke({
    messages: [
      {role: "user", content: "What is the weather like in New York?"}]
  })
)
