// routes/eventRoutes.ts
import express from "express";
import { createEvent } from "../controllers/evenController";

const router = express.Router();

router.post("/create", createEvent);

export default router;
