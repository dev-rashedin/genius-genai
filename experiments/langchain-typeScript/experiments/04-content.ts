import {HumanMessage} from "langchain"

// Simple text content
const text = new HumanMessage("Hello world!");

// Provider-native format (e.g., OpenAI)

const native = new HumanMessage({
  content: [
    {type: "text", text: "Hello, what is this?"},
    {tpe: "image_url", image_url: {url: "https://example.com/image.jpg"}},
  ]
})

const contentBlocks = new HumanMessage({
  contentBlocks: [
    {type: "text", text: "Hello, what is this?"},
    {type: "image", url: "https://example.com/image.jpg"},
  ]
})