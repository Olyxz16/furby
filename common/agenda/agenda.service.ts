import { getAgendaFromId, getAgendaIdByUserId, setAgendaFromId, linkAgendaToUser as linkAgendaUser, listAgendas } from "./agenda.repository";
import { AgendaDto, AgendaTransformationError, fromAgendaDto, GetAgendaByUserDto, LinkAgendaToUserDto, toAgendaDto, UpdateAgendaDto } from "./dto/agenda.dto";
import { Agenda, AgendaIdentifier } from "./agenda.entity";


export async function getAgendaFromUser(input: GetAgendaByUserDto): Promise<AgendaDto> {
  const agendaId = await getAgendaIdByUserId({userId: input.user.id});
  const agenda = await getAgendaFromId(agendaId);
  return toAgendaDto(agenda);
}

export async function updateAgendaFromUser(input: UpdateAgendaDto): Promise<void> {
  let agenda;
  try {
    agenda = fromAgendaDto(input.agenda);
  } catch(e) {
    throw new AgendaTransformationError("Error while transforming agenda dto");
  }
  const agendaId = await getAgendaIdByUserId({userId: input.user.id});
  return setAgendaFromId(agendaId, agenda);
}

export async function linkAgendaToUser(input: LinkAgendaToUserDto): Promise<Agenda> {
  const identifier = await linkAgendaUser(input);
  const agenda = await getAgendaFromId(identifier.agenda_id);
  return agenda;
}

export async function getAllAgendaIdentifiers(): Promise<AgendaIdentifier[]> {
  return listAgendas();
}
