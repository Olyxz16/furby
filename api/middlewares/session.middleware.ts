import { getUserFromSessionToken } from "../../common/auth/auth.service";
import { User } from "../../common/user/user.entity";
import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../common/auth/types";

export const checkAuthenticatedUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  const token = cookies["session"];
  const user = getUserFromSessionToken(token);
  if(!user) {
    return res.status(401).json({"error": "Unauthorized"});
  }
  req.sessionToken = token;
  req.user = user;
  next();
};
