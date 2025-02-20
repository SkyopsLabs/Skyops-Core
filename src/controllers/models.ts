import { Model } from "../models/Model";

// Get AI Models
export const getModels = async (req: any, res: any) => {
  const userId = req.user.id;
  if (!userId) return res.status(401).json({ msg: "Authorization Error" });

  try {
    const models = await Model.find();

    return res.status(200).json(models);
  } catch (error) {
    console.error("Error in getting ai models: ", error);
    return null;
  }
};

// Get Ai Model By Model Id
export const getModelById = async (req: any, res: any) => {
  const userId = req.user.id;
  if (!userId) return res.status(401).json({ msg: "Authorization Error" });

  const modelId = req.params.id;
  if (!modelId)
    return res.status(400).json({ msg: "Bad request: modelId was not sent" });

  try {
    const model = await Model.findById(modelId);

    return res.status(200).json(model);
  } catch (error) {
    console.error("Error in getting model by id: ", error);
    return null;
  }
};
