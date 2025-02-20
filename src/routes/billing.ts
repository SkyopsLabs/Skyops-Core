import express from "express";

// Load Middlewares
import { auth } from "../middlewares/auth";

// Load Controllers
import { getBillings, handleBilling } from "../controllers/billing";

const router = express.Router();

router.get("/", auth, getBillings);
router.post("/", auth, handleBilling);

export default router;
