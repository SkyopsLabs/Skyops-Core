import { User } from "../models/User";
import { Billing } from "../models/Billing";

export const getBillings = async (req: any, res: any) => {
  const userId = req.user.id;
  if (!userId)
    return res.status(400).json({ msg: "Bad request: wallet was not sent" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const billings = await Billing.find({ user: user._id }).populate("user");

    return res.status(200).json(billings);
  } catch (error) {
    console.error("Error in billing history: ", error);
    return res.status(500).json("Internal server error");
  }
};

export const handleBilling = async (req: any, res: any) => {
  const userId = req.user.id;
  const amount = req.body.amount;

  if (!userId || !amount)
    return res
      .status(400)
      .json({ msg: "Bad request: wallet address and amount were not sent" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await Billing.create({ user: user._id, amount });

    // Top Up Balance
    user.balance += amount;
    await user.save();

    const billings = await Billing.find({ user: user._id }).populate("user");

    return res.status(200).json(billings);
  } catch (error) {
    console.error("Error in user registration: ", error);
    return res.status(500).json("Internal server error");
  }
};
