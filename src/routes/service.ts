import express from "express";

// Load Auth Middleware
import { auth } from "../middlewares/auth";

// Load Controllers
import { getServices } from "../controllers/service";

const router = express.Router();

router.get("/", auth, getServices);

export default router;
