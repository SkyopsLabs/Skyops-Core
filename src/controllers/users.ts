import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { jwtSecret } from "../config/passport";
import { Organization } from "../models/Organization";
import { Model } from "../models/Model";

export const getUser = async (req: any, res: any) => {
  const userId = req.user.id;
  if (!userId)
    return res
      .status(400)
      .json({ msg: "Bad request: wallet address was not sent" });

  try {
    const user = await User.findById(userId);
    if (user) {
      return res.status(200).json(user);
    } else return res.status(200).json({ user, billings: null });
  } catch (error) {
    console.error("Error in user fetch: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const authUser = async (req: Request, res: any) => {
  const wallet = req.body.address;
  if (!wallet)
    return res
      .status(400)
      .json({ msg: "Bad request: wallet address was not sent" });

  try {
    const user = await User.findOne({ wallet });
    if (!user) {
      // Register
      const newUser = await User.create({ wallet });

      await Organization.create({ owner: newUser._id });

      const payload = {
        user: {
          id: newUser._id,
        },
      };

      jwt.sign(payload, jwtSecret, { expiresIn: "2 days" }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      });
    } else {
      // Login
      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(payload, jwtSecret, { expiresIn: "2 days" }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      });
    }
  } catch (error) {
    console.error("Error in user registration: ", error);
    return res.status(500).json("Internal server error");
  }
};

export const updateProfile = async (req: any, res: any) => {
  const userId = req.user.id;
  if (!userId) return res.status(401).json({ msg: "Authorization Failed" });

  const username = req.body.username;
  if (!username)
    return res.status(400).json({ msg: "Bad request: username was not sent" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.username = username;
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in updating a profile: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const topUpTokens = async (req: any, res: any) => {
  const userId = req.user.id;
  if (!userId) return res.status(401).json({ msg: "Authorization failed" });

  const modelId = req.body.model;
  const tokenType = req.body.token;
  if (!modelId || !tokenType)
    return res.status(404).json({ msg: "Model Id and type were not found" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const model = await Model.findById(modelId);
    if (!model) return res.status(404).json({ msg: "Model not found" });

    const priceInUsd =
      tokenType === 1 ? model.pricePerInference : model.pricePerFineTune;
    if (user.balance < priceInUsd)
      return res.status(400).json({ msg: "Balance is not enough" });

    user.balance -= priceInUsd;
    user.tokens += 1000000;
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in top up tokens: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
