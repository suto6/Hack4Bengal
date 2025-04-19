// controllers/whatsappController.ts
import { Request, Response } from "express";
import { handleWhatsAppMessage, sendWhatsAppMessage } from "../services/twilioBot";

// Handle incoming WhatsApp webhook
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const { From, Body } = req.body;

    if (!From || !Body) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Process the message and generate a response
    const response = await handleWhatsAppMessage(From, Body);

    // For synchronous responses (Twilio expects TwiML)
    res.set("Content-Type", "text/xml");
    res.send(`
      <Response>
        <Message>${response}</Message>
      </Response>
    `);

    // For asynchronous responses (if you want to process in background)
    // res.status(200).send('Message received');
    // await sendWhatsAppMessage(From.replace('whatsapp:', ''), response);
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
};

// Test endpoint to send a WhatsApp message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    await sendWhatsAppMessage(to, message);

    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};
