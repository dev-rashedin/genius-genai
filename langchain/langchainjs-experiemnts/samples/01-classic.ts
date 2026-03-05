import { initChatModel } from "langchain";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AzureChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const model = new AzureChatOpenAI({ model: "gpt-5-mini" });

// Or use the new helper
// const model = await initChatModel("azure_openai:gpt-5-mini");

const chunks = await ChatPromptTemplate.fromMessages([["human", "{input}"]])
  .pipe(model)
  .stream({ input: "Say hello in 5 different language, one per line" });

for await (const chunk of chunks) {
  if (chunk.content) {
    process.stdout.write(chunk.content as string);
  }
}
