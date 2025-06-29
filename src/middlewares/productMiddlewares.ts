import { Request, Response, NextFunction } from "express";
import { verifyToken, jwtInterface } from "@/config/jwt.js";

interface authenticatedRequest extends Request {
  user: jwtInterface;
}

//for admins only
export const authonticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ errors: true, success: false, message: "tokenman dawet?!" });
    }

    const decoded = verifyToken(token);
    if (decoded.role !== "admin") {
      return res
        .status(404)
        .json({ success: false, message: " admin nit to?!" });
    }

    req.user = decoded;
    next();
  } catch (e) {
    res.status(404).json({
      errors: true,
      message: "یان تۆکنەکە غەلەتە، یان هەر وجەدی نییە؟",
    });
  }
};

//customer specific authorizatyion
export const authonticateCustomer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ errors: true, success: false, message: "tokenman dawet?!" });
    }

    const decoded = verifyToken(token);
    if (decoded.role !== "customer") {
      return res
        .status(404)
        .json({ success: false, message: "to customer nit?!" });
    }

    req.user = decoded;
    next();
  } catch (e) {
    res.status(404).json({
      errors: true,
      message: "یان تۆکنەکە غەلەتە، یان هەر وجەدی نییە؟",
    });
  }
};
