import { Service } from "../models/Service";

export const getServices = async (req: any, res: any) => {
  const userId = req.user.id;
  if (!userId) return res.status(401).json({ msg: "Authorization Failed" });

  try {
    const services = await Service.find();

    return res.status(200).json(services);
  } catch (error) {
    console.error("Error in getting services: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
