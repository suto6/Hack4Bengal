// models/Event.ts
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: String,
  details: String,
  time: String,
  whatsappNumber: String,
  whatsappMessage: String,
});

export const Event = mongoose.model("Event", eventSchema);
