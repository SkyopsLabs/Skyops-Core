import express from "express";

// Load Auth Middleware
import { auth } from "../middlewares/auth";

// Load Controllers
import { getModelById, getModels } from "../controllers/models";

const router = express.Router();

router.get("/", auth, getModels);
router.get("/:id", auth, getModelById);

export default router;
