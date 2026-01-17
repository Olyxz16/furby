import type { PlanningSlot } from "../data/models/Planning";
import { apiFetch } from "./api";
import type { AgendaDto } from "../../../common/agenda/dto/agenda.dto";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

function agendaDtoToPlanning(dto: AgendaDto): PlanningSlot[] {
  const slots: PlanningSlot[] = [];
  const data = dto?.data || [];
  for (let dayIndex = 0; dayIndex < data.length; dayIndex++) {
    const row = data[dayIndex] || [];
    for (let hourIndex = 0; hourIndex < row.length; hourIndex++) {
      const subject = (row[hourIndex] || "").toString().trim();
      if (!subject) continue;

      const hour = 8 + hourIndex;
      const time = `${hour.toString().padStart(2, "0")}:00`;
      const id = `${dayIndex}-${hourIndex}`;

      slots.push({
        id,
        studentId: "",
        day: WEEKDAYS[dayIndex] ?? ("Monday" as const),
        time,
        subject,
        room: undefined,
      });
    }
  }

  return slots;
}

export async function listPlanningSlots(): Promise<PlanningSlot[]> {
  const dto = await apiFetch<AgendaDto>("/agendas/me");
  if (dto && Array.isArray(dto.data)) {
    return agendaDtoToPlanning(dto);
  }
  throw new Error("Unexpected agenda format from API");
}
