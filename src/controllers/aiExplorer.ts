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
  const conversationId = req.body.conversationId;
  if (!prompt || !modelId || !conversationId)
    return res.status(400).json({ msg: "Bad request: Missing required fields" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });
  
    const model = await Model.findById(modelId);
    if (!model) return res.status(404).json({ msg: "Model not found" });

    // generate ai text
    const aiResponse = await generateAiTextUtil(
      model.name,
      prompt,
      systemPrompt
    );
    if (!aiResponse)
      return res.status(500).json({ msg: "Internal server error" });

    // Add message to existing conversation
    // Calculate tokens for the user's prompt
    const userTokens = prompt.split(' ').length; // Simple token calculation based on word count

    // Add user's message to the conversation
    await TextHub.findByIdAndUpdate(
      conversationId,
      {
      $push: {
        conversations: {
        sender: "user",
        message: prompt,
        tokens: userTokens,
        },
      },
      updated_at: Date.now(),
      }
    );

    // Add AI's response to the conversation
    const chat = await TextHub.findByIdAndUpdate(
      conversationId,
      {
      $push: {
        conversations: {
        sender: "system",
        model: model.name,
        message: aiResponse.content,
        tokens: aiResponse.tokens,
        },
      },
      updated_at: Date.now(),
      },
      { new: true }
    );

    if (!chat) return res.status(404).json({ msg: "Conversation not found" });

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

// Create new conversation
export const createConversation = async (req: any, res: any) => {
  const userId = req.user.id;
  if (!userId) return res.status(401).json({ msg: "Authorization Failed" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const newConversation = await TextHub.create({
      user: user._id,
      conversations: [],
    });

    return res.status(201).json({ conversationId: newConversation._id });
  } catch (error) {
    console.error("Error in creating new conversation: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
