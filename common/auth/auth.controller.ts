import express, { Response } from "express";
import { Login, Logout, SignIn } from "./auth.service";
import { toUserDto } from "../user/dto/user.dto";
import { AuthenticatedRequest } from "./types";

export const authRouter = express.Router();

authRouter.post("/signin", async (req, res) => {
  const { mail, password } = req.body;
  try {
    const { user, session } = await SignIn({mail, password})
    res.cookie("session", session.token);
    const dto = toUserDto(user);
    res.status(201).json(dto);
    return;
  } catch(err) {
    console.error(err);
    return res.status(500).json({"error": "Internal server error"});
  }
});

authRouter.post("/login", async (req, res) => {
  const { mail, password } = req.body;
  try {
    const session = await Login({mail, password})
    res.cookie("session", session.token);
    res.status(200).json({"status": "ok"});
    return;
  } catch(err) {
    console.error(err);
    return res.status(500).json({"error": "Internal server error"});
  }
});

authRouter.post("/logout", async (req: AuthenticatedRequest, res: Response) => {
  const token = req.sessionToken;
  if(!token) {
    return res.status(401).json({"error": "Unauthorized"});
  }

  try {
    await Logout({ token: token });
    res.clearCookie("session");
    res.status(200).json({"status": "ok"});
  } catch(err) {
    console.error(err);
    return res.status(500).json({"error": "Internal server error"});
  }
});