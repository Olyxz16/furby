import { User } from "../../user/user.entity";
import { Agenda, Day, Hour } from "../agenda.entity";

export interface LinkAgendaToUserDto {
  userId: string;
  agendaId: string;
}

export interface GetAgendaIdByUserIdDto {
  userId: number;
}

export interface GetAgendaByUserDto {
  user: User;
}

export interface UpdateAgendaDto {
  user: User;
  agenda: AgendaDto;
}

export interface AgendaDto {
  data: string[][];
}

export class AgendaTransformationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AgendaTransformationError';
  }
}

export function toAgendaDto(agenda: Agenda): AgendaDto {
  let data: string[][] = [];

  for(let i = 0; i < 5 ; i++) {
    data.push([]);
    for(let j = 0; j < 10 ; j++) {
      const day = i as Day;
      const hour = j + 8 as Hour;
      
      const value = agenda.get(day, hour) || "";
      data[i].push(value);
    }
  }

  return {
    data: data
  };
}
export function fromAgendaDto(dto: AgendaDto): Agenda {
  if(dto.data.length !== 5) {
    throw new AgendaTransformationError("Agenda format invalid");
  }

  let agenda = new Agenda();
  for(let i = 0; i < 5 ; i++) {
    if(dto.data[i].length !== 10) {
      throw new AgendaTransformationError("Agenda format invalid");
    }

    for(let j = 0; j < 10 ; j++) {
      const day = i as Day;
      const hour = j + 8 as Hour;
      
      const value = dto.data[i][j] || "";
      agenda.set(day, hour, value.toString());
    }
  }

  return agenda;
}
