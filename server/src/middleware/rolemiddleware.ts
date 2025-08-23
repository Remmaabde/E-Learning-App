import { Request, Response, NextFunction } from "express";

import { AuthRequest } from "./authmiddleware";
import { JwtPayload } from "jsonwebtoken";

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || typeof req.user === "string" || !("role" in req.user)) {
      return res.status(403).json({ error: "Access denied: no role" });
    }

    if (!roles.includes((req.user as JwtPayload).role)) {
      return res.status(403).json({ error: "Access denied: insufficient permissions" });
    }

    next();
  };
};

