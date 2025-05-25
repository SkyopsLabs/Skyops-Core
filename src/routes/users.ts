import express from "express";

// Load Auth Middleware
import { auth } from "../middlewares/auth";

// Load Controllers
import {
  getUser,
  authUser,
  updateProfile,
  topUpTokens,
  addPoints,
  getConvos,
} from "../controllers/users";

const router = express.Router();

router.get("/", auth, getUser);
router.post("/", authUser);
router.post("/update-profile", auth, updateProfile);
router.post("/top-up", auth, topUpTokens);
router.post("/points", auth, addPoints);
router.get("/chats", auth, getConvos);

export default router;
