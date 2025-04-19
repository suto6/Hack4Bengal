// app.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import eventRoutes from "./routes/eventRoutes";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/event", eventRoutes);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(3000, () => console.log("Backend running on port 3000"));
  });
