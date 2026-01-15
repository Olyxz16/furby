import express, { Response } from "express";
import { CreateMagicLink, Login, Logout, SignIn } from "./auth.service";
import { toUserDto } from "../user/dto/user.dto";
import { AuthenticatedRequest } from "./types";
import { randomBytes } from "crypto";

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

authRouter.post("/magic-link", async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if(!user) {
    return res.status(401).json({"error": "Unauthorized"});
  }

  try {
    const link = randomBytes(16).toString('hex');
    const magicLink = await CreateMagicLink({ userId: user.id, link });
    res.status(201).json({ link: magicLink.link });
  } catch(err) {
    console.error(err);
    return res.status(500).json({"error": "Internal server error"});
  }
});