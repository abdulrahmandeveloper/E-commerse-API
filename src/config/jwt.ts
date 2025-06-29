import jwt from "jsonwebtoken";

export interface jwtInterface {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: jwtInterface): string => {
  const secret =
    process.env.JWT_SECRET ||
    "8e0d6c1f2a3b4d5e6f7a8b9c0d1e2f3a4b5d6e7f8a9b0c1d2e3f4a5b6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5d6e7f8a9b0c1d";
  const expiresIn = process.env.JWT_EXPIRE || "7d";

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): jwtInterface => {
  const secret = process.env.JWT_SECRET || "your-super-secret-jwt-key";

  return jwt.verify(token, secret) as jwtInterface;
};
