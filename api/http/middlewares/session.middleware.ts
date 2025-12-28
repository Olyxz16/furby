import { getUserFromSessionToken } from "@/auth/auth.service";
import { User } from "@/user/user.entity";
import { NextFunction, Request, Response } from "express";

export interface AuthenticatedRequest extends Request {
  user?: User,
}

export const checkAuthenticatedUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  const token = cookies["session"];
  const user = getUserFromSessionToken(token);
  if(!user) {
    return res.status(401).json({"error": "Unauthorized"});
  }
  req.user = user;
  next();
};
