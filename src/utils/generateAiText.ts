// Hf Modules
import { HfInference } from "@huggingface/inference";

const hf_key = process.env.HUGGINGFACE_API_KEY;
const maxTokens = process.env.MAX_TOKENS;
const temperature = process.env.TEMPERATURE;
const inference = new HfInference(hf_key);

export const generateAiTextUtil = async (
  model: string,
  prompt: string,
  systemPrompt: string
) => {
  try {
    const out = await inference.chatCompletion({
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
    });

    const obj = {
      tokens: out.usage.total_tokens,
      content: out.choices[0].message.content,
    };

    console.log({ obj });
    return obj;
  } catch (error) {
    console.error("Error in generating ai text: ", error);
    return null;
  }
};
