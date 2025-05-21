import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { jwtSecret } from "../config/passport";
import { Organization } from "../models/Organization";
import { Model } from "../models/Model";
import crypto from "crypto";

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

const wallets = [
  "0x890085EDedbeDb06E5c266E2a62560e424A3D903",
  "0x004b6d0B4737d893ed0697953920033d94D7C0d0",
  "0xdA3131Fe48a213262cE539C173743D3b0a3Ef2f5",
  "0xB3c12012992Bb1e686bCbC20D35CCF0335d51EE8",
  "0xa57f6d8981d2622f85efCc1589F3877Bd85d2f80",
  "0x9670A77b95665D45c7085ab35295d3E6C343a219",
  "0x89FC634E17EDd183B7E9C7b6a256d908b8Ff4BF9",
  "0xBa5AF371d03aE7A258d48814922ed7F5eb73CffC",
  "0x65Ae11eE28A9D799e8eC8046A15d20B04a85F2E1",
  "0x3a2B9A7DDDf69f2fe43125777B8FC58FE082B749",
  "0xc47f333D5F51C8160de0D7618ca192E6C6cF98d0",
  "0xB0240FD0cCe2aFFb7726B7f5135Fda6b11b6cF71",
  "0xaE28fd016ED415701e56F874cD5585c8C71436D6",
  "0xcec599C105e9C013EF53eA4435c109c0717F043D",
  "0x37f6081C7312A5fAd46Ecba7980860F5F9a92B2E",
  "0xC84ee862D4B7ABa1Be4af15D0EB913d77Da59993",
  "0xC81D7aC40fa0cDf96Fd7DC416a23EB52aaC3b7BA",
  "0xe70608a0177B488537F8A061031C68cE038B388a",
  "0x2c0B1Faa64094765ABEAF953d4631cB47D2e3087",
  "0xc90FF44594d71810b29744f037603d57c8b55F18",
  "0xDD011abba864781a974FE344f9D4f7426103a311",
  "0x34dB85b41744aa30d7EEe64921811828bD88d5d7",
  "0x3a2C16EB7fd736f18449Ce87A29924Ae27F1e81b",
  "0xF38B9a879B62bfF8ff26DDECF471F498d6aca765",
  "0x725985438C41643E9b1C79ff73002010C4873d4a",
  "0xeaA8985aD44f25B4fc56B0A1ee9C5ef8De320219",
  "0x4886035787efC9322595c2E12819647ef0a70A64",
  "0x2Bc93144537512FcA9dE07080F7842D7B200cB46",
  "0xaC607f6E062EC4DA21F1a9f316D792b071Df1177",
  "0xC31C4733eFfdd9CeD83b7D1A1a6BD401d72b32A2",
  "0xC0869de981667E5d0a1731AF4da490C809361115",
  "0x3C4171a7FA98838299FAebA3151682d9D69038aF",
  "0xd94b4b4FE92b57918E39CFc5a0c483D5174c6C4f",
  "0x70E52A89254f60Ffa227dCa8D85963A7E34f18B3",
  "0x35cb340B2581f1D5b28D62C3265677d90D781B95",
  "0xe34df7f3E9959a02e0E1D08fE48d887f9f4277c5",
  "0x246859f4ECB9aeAe4dA07BCA51E7E35268246A53",
  "0x572017f3701b19f4Ee3E7029595D2C2E2C83132A",
  "0x1134F02fcA3c02c081f0b5A1A26350B90eEEaA5c",
  "0xFAa64bE70ECA9905b9e033A5Ff8b0863a2842dd2",
  "0x31E61ff8e0AeB3d5a03cbd7661Af3ea871F2eE5D",
  "0xfeb925325FbebA0715803eE02428F5102739f52B",
  "0x4dF3f8d7169E8A9C243f1BC0086c04d9F4b5843f",
  "0x8332dC9b7520145a1E37c1e49Ff12Ac79dfE5A35",
  "0x7099f4fA57C6ba858CE59B8D5E72f867D271AaAf",
  "0xB7D37F2A803080B1Dd449728cB43d68c7d9a0E90",
  "0x8Eaf6c7F35FEF04e747Ad822c1786666d8ECe4c3",
  "0x5C1E3b06e2f2C7148C018bcbB97D897179C62e78",
  "0x34e215cbc37A5D3b2878344fa3d01a6B55BdD126",
  "0x49658402e8AFCd0cbaBa5B310cD5Ec6133Fd724B",
];

export const addPoints = async (req: any, res: any) => {
  return res.status(400).json({ msg: "Minning Not yet Started!" });
  // const userId = req.user.id;

  // const { points } = req.body;

  // if (!userId || !points)  {
  //   return res
  //     .status(400)
  //     .json({ msg: "Bad request: userId and points are required" });
  // }

  // try {
  //   let user = await User.findById(userId);
  //   if (!user) {
  //     return res.status(404).json({ msg: "User not found" });
  //   }

  //   // Optionally, add an entry to the points history
  //   const pointsEntry = {
  //     date: new Date().toLocaleDateString("de-DE"),
  //     type: "Minning",
  //     points,
  //   };
  //   user.points = user.points + points;
  //   user.pointsHistory.push(pointsEntry);
  //   await user.save();

  //   return res.status(200).json({ msg: "Points added successfully", user });
  // } catch (error) {
  //   console.error("Error in adding points: ", error);
  //   return res.status(500).json({ msg: "Internal server error" });
  // }
};
