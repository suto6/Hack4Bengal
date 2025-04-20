// routes/chatRoutes.ts
import express from "express";
import { handleChatMessage } from "../controllers/chatController";

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log('Chat route accessed:', req.method, req.path, req.body);
  next();
});

// Handle chat messages
router.post("/", handleChatMessage);

export default router;
