// controllers/testController.ts
import { Request, Response } from "express";

// Simple test endpoint
export const testEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Test endpoint called');
    console.log('Raw request body:', req.body);
    console.log('Request body as JSON:', JSON.stringify(req.body));
    
    res.status(200).json({
      success: true,
      message: 'Test endpoint working',
      receivedData: req.body
    });
  } catch (err) {
    console.error("Test endpoint error:", err);
    res.status(500).json({ error: "Test endpoint failed" });
  }
};
