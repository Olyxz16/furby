import { AgendaDto } from "@/agenda/dto/agenda.dto";
import { GetAgendaFromDiscordIdDto } from "./dto/user.dto";
import { getUserByDiscordId } from "./user.repository";
import { getAgendaFromUser } from "@/agenda/agenda.service";

export async function getAgendaFromDiscordId(input: GetAgendaFromDiscordIdDto): Promise<AgendaDto> {
  const user = await getUserByDiscordId(input);
  if(!user) {
    throw new Error("Could not authenticate user");
  }
  const agenda = await getAgendaFromUser({user: user});
  return agenda; 
}
