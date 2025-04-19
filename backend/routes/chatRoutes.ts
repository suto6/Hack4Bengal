// routes/chatRoutes.ts
import express from "express";
import { handleChatMessage } from "../controllers/chatController";

const router = express.Router();

// Handle chat messages
router.post("/", handleChatMessage);

export default router;
