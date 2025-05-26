// Hf Modules
import { InferenceClient } from "@huggingface/inference";
import OpenAI from "openai";

const hf_key = process.env.HUGGINGFACE_API_KEY;
const maxTokens = process.env.MAX_TOKENS;
const temperature = process.env.TEMPERATURE;
const hf = new InferenceClient(hf_key);

const api_key = process.env.DEEPSEEK_API_KEY;

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: api_key,
});

export const generateAiTextUtil = async (
  model: string,
  prompt: string,
  systemPrompt: string,
  temperature: number,
  maxTokens: number
) => {
  try {
    const chat = !model.includes("deep")
      ? await hf.chatCompletion({
          model,
          messages: [
            {
              role: "system",
              content:
                systemPrompt ??
                "You are a music teacher and your name is Godwin, help with theory and fundamentals about music.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: Number(maxTokens),
          temperature: Number(temperature),
        })
      : await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: systemPrompt ?? "You are a helpful assistant.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "deepseek-chat",
          temperature: Number(temperature),
          max_tokens: Number(maxTokens),
        });

    const obj = {
      tokens: chat.usage?.total_tokens,
      content: chat.choices[0].message.content,
    };

    console.log({ obj });
    return obj;
  } catch (error) {
    console.error("Error in generating ai text: ", error);
    return null;
  }
};
