import { NextFunction, Request, Response } from "express";

export default function authzMiddlewar() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const payload = (req as any).payload;

    if (payload?.isSuperAdmin !== true) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return next();
  };
}
