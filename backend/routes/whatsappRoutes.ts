// routes/whatsappRoutes.ts
import express from "express";
import { handleWebhook, sendMessage } from "../controllers/whatsappController";

const router = express.Router();

// Handle incoming WhatsApp webhook
router.post("/webhook", handleWebhook);

// Test endpoint to send a WhatsApp message
router.post("/send", sendMessage);

export default router;
