import { Model } from "../models/Model";
import { TextHub } from "../models/TextHub";
import { User } from "../models/User";
import { generateAiTextUtil } from "../utils/generateAiText";

/* Ai Explorer: Text */
// Generate Ai Text
export const generateAiText = async (req: any, res: any) => {
  const userId = req.user.id;
  if (!userId) return res.status(401).json({ msg: "Authorization Failed" });

  const prompt = req.body.prompt;
  const systemPrompt = req.body.systemPrompt;
  const modelId = req.body.model;
  if (!prompt || !modelId)
    return res.status(400).json({ msg: "Bad request: Prompt was not sent" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const model = await Model.findById(modelId);
    if (!model) return res.status(404).json({ msg: "Model not found" });

    // if (user.tokens === 0)
    //   return res.status(400).json({ msg: "Not Enough Tokens" });

    // generate ai text
    const aiResponse = await generateAiTextUtil(
      model.name,
      prompt,
      systemPrompt
    );
    if (!aiResponse)
      return res.status(500).json({ msg: "Internal server error" });

    // Store Text data
    const chat = await TextHub.create({
      user: user._id,
      content: aiResponse.content,
      tokens: aiResponse.tokens,
    });

    // Update User info
    user.tokens =
      user.tokens < aiResponse.tokens ? 0 : user.tokens - aiResponse.tokens;
    await user.save();

    return res.status(200).json(chat);
  } catch (error) {
    console.error("Error in generating Ai Text: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
