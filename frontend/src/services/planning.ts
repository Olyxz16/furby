import type { PlanningSlot } from "../data/models/Planning";
import { planningSlots as mock } from "../data/mock/planning";

export async function listPlanningSlots(studentId: string): Promise<PlanningSlot[]> {
  return mock.filter((p) => p.studentId === studentId);
}
