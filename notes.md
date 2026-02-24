# Learn LangChain: The Complete Beginner-Friendly Guide

LangChain is a framework for building applications powered by **large language models (LLMs)**. It helps developers go beyond simple prompts and unlock structured, multi-step, and memory-enabled workflows with LLMs.

---

## Table of Contents

1. [What is LangChain?](#what-is-langchain)
2. [Why LangChain?](#why-langchain)
3. [How LangChain Works](#how-langchain-works)
4. [Core Concepts](#core-concepts)

   * [Prompt Templates](#prompt-templates)
   * [Chains](#chains)
   * [Agents & Tools](#agents--tools)
   * [Memory](#memory)
   * [Structured Output](#structured-output)
   * [Document Loaders & Text Splitters](#document-loaders--text-splitters)
   * [Retrieval-Augmented Generation (RAG)](#retrieval-augmented-generation-rag)
5. [Python & TypeScript Examples](#python--typescript-examples)
6. [Getting Started](#getting-started)
7. [Further Resources](#further-resources)

---

## What is LangChain?

LangChain is a **framework** that simplifies building applications on top of LLMs.
Instead of just sending a text prompt to an LLM and getting raw output, LangChain helps you:

* Structure prompts
* Connect multiple LLM calls together (**chains**)
* Use tools and APIs inside an LLM workflow (**agents**)
* Remember past interactions (**memory**)
* Work with documents intelligently (**RAG workflows**)

It’s available in **Python** (most mature) and **JavaScript/TypeScript** (for Node.js or frontend apps).

---

## Why LangChain?

### Problems LangChain Solves

1. **Unstructured LLM output**

   * LLMs return text. Extracting structured, usable information is hard.
   * LangChain provides **structured output**, like JSON, `Pydantic` models, or TypeScript types.

2. **Multi-step reasoning**

   * Many applications need **more than one LLM call** (e.g., query → process → summarize).
   * LangChain handles these **chains** elegantly.

3. **Tool integration**

   * LLMs can call APIs, calculators, databases, etc.
   * LangChain agents handle **dynamic tool selection**.

4. **Memory & context**

   * LLMs have limited context; LangChain allows **short-term or long-term memory**.

5. **Working with documents**

   * For QA over large texts, LangChain enables **RAG pipelines** with vector stores.

---

## How LangChain Works

At its core, LangChain revolves around connecting **components**:

```
Prompt -> LLM -> Chain -> Agent -> Memory -> Output
```

* **Prompt**: The input template for the LLM
* **LLM**: The language model (OpenAI, GPT, etc.)
* **Chain**: Multi-step workflows
* **Agent**: Decides which tools or chains to call
* **Memory**: Stores previous interactions
* **Output**: Structured, actionable data

---

## Core Concepts

### 1. Prompt Templates

Templates let you define **dynamic prompts**.

**Python Example**

```python
from langchain.prompts import PromptTemplate

template = "Translate this text to French: {text}"
prompt = PromptTemplate(template=template, input_variables=["text"])

prompt.format(text="Hello World")  # "Translate this text to French: Hello World"
```

**TypeScript Example**

```ts
import { PromptTemplate } from "langchain/prompts";

const template = "Translate this text to French: {text}";
const prompt = new PromptTemplate({ template, inputVariables: ["text"] });

await prompt.format({ text: "Hello World" });
// "Translate this text to French: Hello World"
```

---

### 2. Chains

Chains are **sequences of calls**—you can chain multiple prompts, LLMs, or functions.

**Python Example**

```python
from langchain.chains import LLMChain
from langchain.llms import OpenAI

llm = OpenAI(temperature=0)
chain = LLMChain(llm=llm, prompt=prompt)

chain.run("How are you?")
```

**TypeScript Example**

```ts
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";

const llm = new OpenAI({ temperature: 0 });
const chain = new LLMChain({ llm, prompt });

await chain.call({ text: "How are you?" });
```

---

### 3. Agents & Tools

Agents allow the model to **choose actions dynamically**, using tools like calculators, APIs, or custom functions.

**Python Example**

```python
from langchain.agents import initialize_agent, Tool
from langchain.llms import OpenAI

def calculator(input: str):
    return str(eval(input))

tools = [Tool(name="Calculator", func=calculator, description="Performs math")]

agent = initialize_agent(tools, OpenAI(temperature=0), agent="zero-shot-react-description")
agent.run("Calculate 25*6")
```

**TypeScript Example**

```ts
import { initializeAgentExecutor } from "langchain/agents";
import { OpenAI } from "langchain/llms/openai";

const calculator = (input: string) => eval(input).toString();

const tools = [{ name: "Calculator", func: calculator, description: "Performs math" }];

const agent = await initializeAgentExecutor(tools, new OpenAI({ temperature: 0 }), "zero-shot-react-description");
await agent.run("Calculate 25*6");
```

---

### 4. Memory

Memory allows **stateful conversations**.

**Python Example**

```python
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.llms import OpenAI

memory = ConversationBufferMemory()
chain = ConversationChain(llm=OpenAI(temperature=0), memory=memory)

chain.run("Hi!")
chain.run("Who am I talking to?")
```

**TypeScript Example**

```ts
import { ConversationChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";

const memory = new BufferMemory();
const chain = new ConversationChain({ llm: new OpenAI({ temperature: 0 }), memory });

await chain.call({ input: "Hi!" });
await chain.call({ input: "Who am I talking to?" });
```

---

### 5. Structured Output

Ensure the LLM returns **predictable formats**, like JSON or models.

**Python Example (Pydantic)**

```python
from pydantic import BaseModel
from langchain.output_parsers import PydanticOutputParser

class Person(BaseModel):
    name: str
    age: int

parser = PydanticOutputParser(pydantic_object=Person)
parser.parse('{"name": "Alice", "age": 30}')
```

**TypeScript Example (TypeDict)**

```ts
import { StructuredOutputParser } from "langchain/output_parsers";

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  name: "string",
  age: "number"
});

await parser.parse('{"name": "Alice", "age": 30}');
```

---

### 6. Document Loaders & Text Splitters

* Load text files, PDFs, or websites
* Split into manageable chunks for embeddings or retrieval

---

### 7. Retrieval-Augmented Generation (RAG)

* Store documents in **vector databases**
* Retrieve relevant chunks for LLM queries

**Python Example**

```python
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_texts(["Hello world"], embeddings)
vectorstore.similarity_search("Hi")
```

**TypeScript Example**

```ts
import { FAISS } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const embeddings = new OpenAIEmbeddings();
const vectorstore = await FAISS.fromTexts(["Hello world"], embeddings);
await vectorstore.similaritySearch("Hi");
```

---

## Getting Started

1. Install dependencies:

**Python**

```bash
pip install langchain openai
```

**Node.js / TypeScript**

```bash
npm install langchain openai
```

2. Set your API key:

```
export OPENAI_API_KEY="your_api_key_here"
```

3. Start experimenting with chains, agents, and RAG workflows.

---

## Further Resources

* [LangChain Docs](https://www.langchain.com/docs/)
* [OpenAI API Docs](https://platform.openai.com/docs/)
* Krish Naik LangChain Tutorials
* Community Examples on GitHub

---

**This is your one-stop roadmap for LangChain**, covering core concepts and examples in both **Python** and **TypeScript**.


