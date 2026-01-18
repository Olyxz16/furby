import { AgendaDto } from "@/agenda/dto/agenda.dto";
import { GetAgendaFromDiscordIdDto } from "./dto/user.dto";
import { getUserByDiscordId } from "./user.repository";
import { getAgendaFromUser } from "@/agenda/agenda.service";
import { DiscordAccountNotLinkedError } from "@/agenda/agenda.error";

export async function getAgendaFromDiscordId(input: GetAgendaFromDiscordIdDto): Promise<AgendaDto> {
  let user;
  try {
    user = await getUserByDiscordId(input);
  } catch(err: any) {
    throw new DiscordAccountNotLinkedError("Could not authenticate user");
  }
  const agenda = await getAgendaFromUser({user: user});
  return agenda; 
}
