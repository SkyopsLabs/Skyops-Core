import express from "express";

// Load Auth Middleware
import { auth } from "../middlewares/auth";

// Load Controllers
import { generateAiText } from "../controllers/aiExplorer";

const router = express.Router();

router.post("/text/generate", auth, generateAiText);

export default router;
