import dotenv from "dotenv";
import mongoose from "mongoose";

import { Model } from "../models/Model";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("MongoDB is connected."))
  .catch((err) => console.error(err));

const models = [
  {
    name: "meta-llama/Llama-3.1-8B-Instruct",
    description:
      "The Meta Llama 3.1 collection of multilingual large language models (LLMs) is a collection of pretrained and instruction tuned generative models in 8B, 70B and 405B sizes (text in/text out). The Llama 3.1 instruction tuned text only models (8B, 70B, 405B) are optimized for multilingual dialogue use cases and outperform many of the available open source and closed chat models on common industry benchmarks.",
    pricePerInference: 0.08,
    pricePerFineTune: 0.96,
    link: "https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct",
    type: "Text",
  },
  {
    name: "mistralai/Mistral-7B-Instruct-v0.3",
    description:
      "The Mistral-7B-v0.1 Large Language Model (LLM) is a pretrained generative text model with 7 billion parameters. Mistral-7B-v0.1 outperforms Llama 2 13B on all benchmarks we tested.",
    pricePerInference: 0.2,
    pricePerFineTune: 0.96,
    link: "https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.1",
    type: "Text",
  },
  {
    name: "meta-llama/Llama-3.2-3B-Instruct",
    description:
      "The Meta Llama 3.2 collection of multilingual large language models (LLMs) is a collection of pretrained and instruction-tuned generative models in 1B and 3B sizes (text in/text out). The Llama 3.2 instruction-tuned text only models are optimized for multilingual dialogue use cases, including agentic retrieval and summarization tasks. They outperform many of the available open source and closed chat models on common industry benchmarks.",
    pricePerInference: 0.04,
    pricePerFineTune: 0.48,
    link: "https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct",
    type: "Text",
  },
  {
    name: "google/gemma-2-9b-it",
    description:
      "Gemma is a family of lightweight, state-of-the-art open models from Google, built from the same research and technology used to create the Gemini models. They are text-to-text, decoder-only large language models, available in English, with open weights for both pre-trained variants and instruction-tuned variants. Gemma models are well-suited for a variety of text generation tasks, including question answering, summarization, and reasoning. Their relatively small size makes it possible to deploy them in environments with limited resources such as a laptop, desktop or your own cloud infrastructure, democratizing access to state of the art AI models and helping foster innovation for everyone.",
    pricePerInference: 0.16,
    pricePerFineTune: 0.96,
    link: "https://huggingface.co/google/gemma-2-9b",
    type: "Text",
  },
];

(async () => {
  if (models.length > 0) {
    for (let i = 0; i < models.length; i++) {
      await Model.create({
        name: models[i].name,
        description: models[i].description,
        pricePerInference: models[i].pricePerInference,
        pricePerFineTune: models[i].pricePerFineTune,
        link: models[i].link,
        type: models[i].type,
      });
    }
  }
})();
