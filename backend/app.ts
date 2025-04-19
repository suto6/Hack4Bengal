// app.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";

// Import routes
import eventRoutes from "./routes/eventRoutes";
import whatsappRoutes from "./routes/whatsappRoutes";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // For parsing Twilio webhook data

// Static files - for accessing uploaded PDFs if needed
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/event", eventRoutes);
app.use("/api/whatsapp", whatsappRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start the server regardless of MongoDB connection
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
    console.log(`WhatsApp webhook URL: http://your-domain.com/api/whatsapp/webhook`);
  });
};

// Try to connect to MongoDB, but start server even if it fails
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      startServer();
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      console.log("Starting server without MongoDB...");
      startServer();
    });
} else {
  console.log("No MongoDB URI provided. Starting server with in-memory storage...");
  startServer();
}
