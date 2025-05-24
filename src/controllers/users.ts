import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { jwtSecret } from "../config/passport";
import { Organization } from "../models/Organization";
import { Model } from "../models/Model";
import crypto from "crypto";
import { wallets } from "../utils/constants";

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
  const referee = req.body.code;
  if (!wallet)
    return res
      .status(400)
      .json({ msg: "Bad request: wallet address was not sent" });

  const generateRefCode = async () => {
    let refCode;
    let existingUser;

    do {
      refCode = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase()
        .replace(/[0-9]/g, (char) => {
          return String.fromCharCode("A".charCodeAt(0) + parseInt(char, 10));
        });

      existingUser = await User.findOne({ code: refCode });
    } while (existingUser);

    return refCode;
  };

  try {
    if (referee) {
      const referrer = await User.findOne({ code: referee });
      if (!referrer) {
        return res.status(400).json({ msg: "Invalid referral code" });
      }
    }

    const user = await User.findOne({ wallet });
    if (!user) {
      // Register
      const refCode = await generateRefCode();
      const pointsEntry = {
        date: new Date().toLocaleDateString("de-DE"),
        type: "Referral",
        points: 10,
      };
      const newUser = await User.create({ wallet, code: refCode, referee });
      // if (referee) {
      //   const referrer = await User.findOne({ code: referee });

      //   await User.updateOne(
      //     { wallet: referrer?.wallet },
      //     { $inc: { points: 0 }, $push: { pointsHistory: pointsEntry } }
      //   );
      // }

      // await Organization.create({ owner: newUser._id });

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

export const addPoints = async (req: any, res: any) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ msg: "Authorization failed" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Only allow wallets in the list
    if (!wallets.includes(user.wallet)) {
      return res.status(403).json({ msg: "Not whitelisted" });
    }

    // Check lastMinedDate (assume it's a Date or null)
    const now = new Date();
    if (user.lastMinedDate) {
      const lastMined = new Date(user.lastMinedDate);
      const diffMs = now.getTime() - lastMined.getTime();
      if (diffMs < 55 * 60 * 1000) {
        return res.status(429).json({ msg: "You can only mine once per hour" });
      }
    }

    const points = req.body.points || 1; // Default to 1 point if not provided

    // Add points and update history
    const pointsEntry = {
      date: now.toLocaleDateString("de-DE"),
      type: "Minning",
      points,
    };
    user.points = (user.points || 0) + points;
    user.pointsHistory = user.pointsHistory || [];
    user.pointsHistory.push(pointsEntry);
    user.lastMinedDate = now;
    await user.save();

    return res.status(200).json({ msg: "Points added successfully", user });
  } catch (error) {
    console.error("Error in adding points: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
