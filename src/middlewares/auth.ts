import { NextFunction, Response } from "express";

import { verifyToken } from "@/config/jwt.js";
import { User } from "@/models/users.js";
import { authRequest } from "@/types/authTypes.js";

// for costmers.
export const authenticate = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "no token , access nya" });
    }
    const token = authHeader?.substring(7);

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "walla naman ditawa?" });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (e) {
    return res.status(401).json({ message: "token valid nya!?" });
  }
};

// for admins
export const authorize = (...roles: string[]) => {
  return (req: authRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "access nya!" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({ message: "permission xhalatra?" });
    }

    next();
  };
};
