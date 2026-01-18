import express, { Response } from "express";
import { AuthenticatedRequest } from "../auth/types";
import { getAgendaFromUser, getAllAgendaIdentifiers, linkAgendaToUser, updateAgendaFromUser } from "./agenda.service";
import { AgendaTransformationError, toAgendaDto } from "./dto/agenda.dto";

export const agendaRouter = express.Router();

agendaRouter.get("/", (_, res) => {
  getAllAgendaIdentifiers()
  .then(result => res.status(200).json(result))
  .catch(_ => res.status(500).json({"error": "Internal server error"}))
});

agendaRouter.get("/me", (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if(!user) {
    return res.status(401).json({"error": "Unauthorized"});
  }
  getAgendaFromUser({user: user})
    .then((agenda) => {
      return res.status(200).json(agenda);
    }) 
    .catch((err) => {
      return res.status(500).json({"error": "Internal server error"});
    });
});

agendaRouter.post("/link", async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if(!user) {
    return res.status(401).json({"error": "Unauthorized"});
  }

  const { agendaId } = req.body;

  try {
    const agenda = await linkAgendaToUser({agendaId: agendaId, userId: user.id.toString()});
    res.status(200).json(toAgendaDto(agenda));
  } catch (e) {
    res.status(400).json({"error": "Invalid agenda id"});
  }
});

agendaRouter.post("/", (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if(!user) {
    return res.status(401).json({"error": "Unauthorized"});
  }

  const { agenda } = req.body;
  updateAgendaFromUser({user: user, agenda: agenda})
    .then((_: any) => {
      res.status(201).json(agenda);
    })
    .catch((err) => {
      if(err instanceof AgendaTransformationError) {
        return res.status(400).json({"error": "Wrong format for given agenda"});
      }
      res.status(500).json({"error": "Internal server error"});
    })

});
