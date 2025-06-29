import { Request } from "express";

export interface authRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}
