// app.ts
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import { initializeEventsFile } from "./services/jsonStorageService";

// Import routes
import eventRoutes from "./routes/eventRoutes";
// WhatsApp routes removed - using web chat only
import chatRoutes from "./routes/chatRoutes";
import mockRoutes from "./routes/mockRoutes";
import testRoutes from "./routes/testRoutes";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // For parsing Twilio webhook data

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('Request body:', JSON.stringify(req.body));
  }
  next();
});

// Static files - for accessing uploaded PDFs if needed
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/event", eventRoutes);
// Mock routes for development
app.use("/api/mock", mockRoutes);
// WhatsApp routes removed - using web chat only
app.use("/api/chat", chatRoutes);
// Test route
app.use("/api/test", testRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Initialize JSON storage and start server
const startServer = () => {
  try {
    // Initialize the events.json file if it doesn't exist
    initializeEventsFile();
    console.log('JSON storage initialized successfully');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
      console.log(`Web chat is available at: http://localhost:3008/event/:eventId`);
    });
  } catch (error) {
    console.error('Error initializing JSON storage:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
