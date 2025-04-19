// controllers/eventController.ts
import { Request, Response } from "express";
import { Event } from "../models/Event";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, details, time, whatsappNumber } = req.body;
    const message = `Hey! I saw your event "${name}" happening at ${time}. I'd love to know more!`;
    const encodedMessage = encodeURIComponent(message);
    const link = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    const event = new Event({
      name,
      details,
      time,
      whatsappNumber,
      whatsappMessage: link,
    });

    await event.save();
    res.status(201).json({ success: true, link });
  } catch (err) {
    res.status(500).json({ error: "Event creation failed" });
  }
};
