import dotenv from "dotenv";

dotenv.config();

// Hf Modules
import { InferenceClient } from "@huggingface/inference";
import OpenAI from "openai";

const api_key = process.env.DEEPSEEK_API_KEY;

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: api_key,
});

const hf_key = process.env.HUGGINGFACE_API_KEY;
const hf = new InferenceClient(hf_key);
const data = {
  // model: "google/gemma-2-9b-it",
  model: "deepseek-chat",
  messages: [
    {
      role: "system",
      content:
        "You are a music teacher, help with theory and fundamentals about music.",
    },
    {
      role: "user",
      content:
        "What is the best way to improve my vocals in a span of three months.",
    },
  ],
  // max_tokens: 512,
  // temperature: 0.5,
};
(async () => {
  try {
    // const chat = await hf.chatCompletion({
    //   // model: "google/gemma-2-9b-it",
    //   // model: "deepseek-ai/DeepSeek-V2-Chat",
    //   model: "meta-llama/Llama-3.1-8B-Instruct",
    //   messages: [
    //     {
    //       role: "user",
    //       content: "What does inference mean?",
    //     },
    //   ],
    //   max_tokens: 512,
    //   temperature: 0.5,
    // });
    const chat = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: "What does Osas mean?",
        },
      ],
      model: "deepseek-chat",
    });

    const obj = {
      tokens: chat.usage?.total_tokens,
      content: chat.choices[0].message.content,
    };
    console.log({ obj });
    // console.log(chat.choices[0]);
  } catch (error) {
    console.log(error);
  }
})();
