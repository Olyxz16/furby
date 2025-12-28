import { getAgendaFromId, getAgendaIdByUserId, setAgendaFromId } from "./agenda.repository";
import { AgendaDto, AgendaTransformationError, fromAgendaDto, GetAgendaByUserDto, toAgendaDto, UpdateAgendaDto } from "./dto/agenda.dto";


export async function getAgendaFromUser(input: GetAgendaByUserDto): Promise<AgendaDto> {
  const agendaId = getAgendaIdByUserId({userId: input.user.id});
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
  const agendaId = getAgendaIdByUserId({userId: input.user.id});
  return setAgendaFromId(agendaId, agenda);
}
