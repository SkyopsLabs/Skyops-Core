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
    return res
      .status(400)
      .json({ msg: "Bad request: Missing required fields" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const model = await Model.findById(modelId);
    if (!model) return res.status(404).json({ msg: "Model not found" });

    // Get or create a conversation ID
    const conversationId = await createConversation(userId);

    type AiResponse = { tokens: number; content: string };
    // Generate AI text
    const aiResponse = (await generateAiTextUtil(
      model.name,
      prompt,
      systemPrompt
    )) as AiResponse;
    if (!aiResponse)
      return res.status(500).json({ msg: "Internal server error" });

    // Calculate tokens for the user's prompt
    const userTokens = prompt.split(" ").length; // Simple token calculation based on word count

    // Add user's message to the conversation
    await TextHub.findByIdAndUpdate(conversationId, {
      $push: {
        conversations: {
          sender: "user",
          message: prompt,
          tokens: userTokens,
        },
      },
      updated_at: Date.now(),
    });

    // Add AI's response to the conversation
    const chat = await TextHub.findByIdAndUpdate(
      conversationId,
      {
        $push: {
          conversations: {
            sender: "assistant",
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
export const createConversation = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Check if the user already has a conversation array
    const existingConversation = await TextHub.findOne({ user: user._id });

    if (!existingConversation) {
      // Create a new conversation if none exists
      const newConversation = await TextHub.create({
        user: user._id,
        conversations: [],
      });

      return newConversation._id; // Return the new conversation ID
    } else {
      // Return the existing conversation ID
      return existingConversation._id;
    }
  } catch (error) {
    console.error("Error in creating or fetching conversation: ", error);
    throw new Error("Failed to create or fetch conversation");
  }
};
