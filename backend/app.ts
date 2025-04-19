// app.ts
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import { seedDatabase } from "./services/prismaService";

// Import routes
import eventRoutes from "./routes/eventRoutes";
// WhatsApp routes removed - using web chat only
import chatRoutes from "./routes/chatRoutes";

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
// WhatsApp routes removed - using web chat only
app.use("/api/chat", chatRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Seed the database with sample data if needed
    await seedDatabase();
    console.log('Database initialized successfully');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
      console.log(`Web chat is available at: http://localhost:3008/event/:eventId`);
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
