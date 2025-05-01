import { Request, Response, NextFunction } from "express";
import { findUserById } from "../models/user";
import { verifyToken } from "../utils/jwt"; // Предполагается, что verifyToken существует

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

// Если есть другой обработчик с аналогичной проблемой:
export const someOtherMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // ... логика ...
  next();
};