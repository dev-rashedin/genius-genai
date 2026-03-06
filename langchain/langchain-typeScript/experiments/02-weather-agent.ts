// experiments/02-weather-agent-fixed.ts

/**
 * 1️⃣ Load environment variables first!
 *    Ensures OPENAI_API_KEY is available in process.env for OpenAI model.
 */
import "dotenv/config"; // Must be first

/**
 * 2️⃣ Import required LangChain and LangGraph utilities
 */
import { tool, initChatModel, createAgent } from "langchain";
import * as z from "zod";
import { systemPrompt } from "./prompts/system-prompt.js";
import { MemorySaver } from "@langchain/langgraph";

/**
 * 3️⃣ Define a simple weather tool
 *    Added async for consistency (even if local), matches LangChain async expectations
 */
const getWeather = tool(
  async (input: { city: string }) => {
    // simulate real async API call (future real API integration)
    return `It's always sunny in ${input.city}!`;
  },
  {
    name: "get_weather_for_location",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
  }
);

/**
 * 4️⃣ User location tool
 *    Fix: use a single input object instead of (_, config), matches LangChain signature
 */
const getUserLocation = tool(
  async (input: { context: { user_id: string } }) => {
    const { user_id } = input.context;
    return user_id === "1" ? "Florida" : "SF";
  },
  {
    name: "get_user_location",
    description: "Retrieve user information based on user ID",
  }
);

/**
 * 5️⃣ Initialize chat model
 *    Fixed model string to use proper OpenAI provider
 *    Increased timeout to 30s to avoid request timeouts
 */
const model = await initChatModel("openai:gpt-4o-mini", {
  temperature: 0,
  max_tokens: 100,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  timeout: 30000,
});

/**
 * 6️⃣ Structured response
 *    Zod object to enforce output schema
 */
const responseFormat = z.object({
  punny_response: z.string(),
  weather_conditions: z.string().optional(),
});

/**
 * 7️⃣ MemorySaver to store conversation threads
 *    Optional but useful for multi-turn conversations
 */
const checkpointer = new MemorySaver();

/**
 * 8️⃣ Create the agent
 *    Uses initialized model instance to ensure consistency
 */
const agent = createAgent({
  model, // pass instance, not raw string
  systemPrompt,
  tools: [getUserLocation, getWeather],
  responseFormat,
  checkpointer,
});

/**
 * 9️⃣ Config object for thread/user
 *    This allows multi-turn conversations to use same thread_id
 */
const config = {
  configurable: { thread_id: "1" },
  context: { user_id: "1" },
};

/**
 * 10️⃣ Invoke agent
 *     First message
 */
const response = await agent.invoke(
  { messages: [{ role: "user", content: "what is the weather outside?" }] },
  config
);
console.log(response.structuredResponse);

/**
 * 11️⃣ Continue conversation with same thread_id
 */
const thankYouResponse = await agent.invoke(
  { messages: [{ role: "user", content: "thank you!" }] },
  config
);
console.log(thankYouResponse.structuredResponse);