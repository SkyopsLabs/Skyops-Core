import express from "express";

// Load Auth Middleware
import { auth } from "../middlewares/auth";

// Load Controllers
import { getOrganization } from "../controllers/organization";

const router = express.Router();

router.get("/", auth, getOrganization);

export default router;
