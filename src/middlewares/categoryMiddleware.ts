import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access token required",
      });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message: "Token has expired",
          });
        }

        if (err.name === "JsonWebTokenError") {
          return res.status(401).json({
            success: false,
            message: "Invalid token",
          });
        }

        return res.status(401).json({
          success: false,
          message: "Token verification failed",
        });
      }

      req.user = decoded as JWTPayload;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
    });
  }
};

// Middleware to check if user is admin
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Admin access required",
    });
    return;
  }

  next();
};

// Generate JWT token
export const generateToken = (
  payload: Omit<JWTPayload, "iat" | "exp">
): string => {
  const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Verify and decode JWT token
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};
