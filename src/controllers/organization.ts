import { Organization } from "../models/Organization";

export const getOrganization = async (req: any, res: any) => {
  const userId = req.user.id;
  if (!userId) return res.status(401).json({ msg: "Authorization Failed" });

  try {
    const organization = await Organization.findOne({ owner: userId });

    return res.status(200).json(organization);
  } catch (error) {
    console.error("Error in getting organization by user id: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
