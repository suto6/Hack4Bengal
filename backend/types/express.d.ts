import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface RequestHandler {
      (req: Request, res: Response, next: NextFunction): any;
    }
  }
}
