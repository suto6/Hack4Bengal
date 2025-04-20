// routes/testRoutes.ts
import express from "express";
import { testEndpoint } from "../controllers/testController";

const router = express.Router();

// Test endpoint
router.post("/", testEndpoint);

export default router;
