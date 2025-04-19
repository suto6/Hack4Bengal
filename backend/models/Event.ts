// models/Event.ts
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: String,
  organizer: String,
  details: String,
  time: String,
  whatsappNumber: String,
  whatsappMessage: String,
  context: String, // Extracted PDF text
  pdfPath: String, // Path to the uploaded PDF file
});

export const Event = mongoose.model("Event", eventSchema);
