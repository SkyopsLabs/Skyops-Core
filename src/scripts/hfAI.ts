import dotenv from "dotenv";

dotenv.config();

// Hf Modules
import { HfInference } from "@huggingface/inference";

const hf_key = process.env.HUGGINGFACE_API_KEY;
const inference = new HfInference(hf_key);
const api_key = process.env.DEEPSEEK_API_KEY;
const data = {
  // model: "google/gemma-2-9b-it",
  model: "deepseek-ai/DeepSeek-V2-Chat",
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
    const out = await inference.chatCompletion({
      // model: "google/gemma-2-9b-it",
      // model: "deepseek-ai/DeepSeek-V2-Chat",
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "user",
          content: "What does inference mean?",
        },
      ],
      max_tokens: 512,
      temperature: 0.5,
    });
    // const out = await fetch("https://api.deepseek.com/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${api_key}`,
    //   },
    //   body: JSON.stringify(data),
    // });
    // const res = await out.json();
    console.log({ out });
    // console.log(res);
    console.log(out.choices[0]);
  } catch (error) {
    console.log(error);
  }
})();
