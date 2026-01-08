import { getUserFromSessionToken } from "../../common/auth/auth.service";
import { User } from "../../common/user/user.entity";
import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../common/auth/types";

export const checkAuthenticatedUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  const token = cookies["session"];
  if (!token) {
     return res.status(401).json({"error": "Unauthorized"});
  }
  
  try {
    const user = await getUserFromSessionToken(token);
    if(!user) {
        return res.status(401).json({"error": "Unauthorized"});
    }
    req.sessionToken = token;
    req.user = user;
    next();
  } catch (e) {
      return res.status(401).json({"error": "Unauthorized"});
  }
};
