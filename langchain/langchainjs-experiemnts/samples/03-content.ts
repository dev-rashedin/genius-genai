import { HumanMessage } from "langchain";

// Simple text content
const text = new HumanMessage("Hello!");

// Provider-native format (e.g., OpenAI)
const native = new HumanMessage({
  content: [
    { type: "text", text: "Hello, what is this?" },
    { type: "image_url", image_url: { url: "https://http.cat/202" }, },
  ],
});

// List of standard content blocks
const contentBlocks = new HumanMessage({
  contentBlocks: [
    { type: "text", text: "Hello, what is this?" },
    { type: "image", url: "https://http.cat/202" },
  ],
});
