import type { PlanningSlot } from "../models/Planning";

export const planningSlots: PlanningSlot[] = [
  { id: "p1", studentId: "s1", day: "Monday", time: "08:00", subject: "Math", room: "A1", updatedAt: "2025-12-29" },
  { id: "p2", studentId: "s1", day: "Tuesday", time: "10:00", subject: "CS", room: "Lab", updatedAt: "2025-12-29" },
  { id: "p3", studentId: "s2", day: "Monday", time: "09:00", subject: "Physics", room: "B2", updatedAt: "2025-12-29" },
  { id: "p4", studentId: "s2", day: "Tuesday", time: "11:00", subject: "English", room: "C3", updatedAt: "2025-12-29" },
  { id: "p5", studentId: "s3", day: "Thursday", time: "14:00", subject: "Lab", room: "Lab", updatedAt: "2025-12-28" }
];
