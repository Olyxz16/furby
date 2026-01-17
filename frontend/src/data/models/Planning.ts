export type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export type PlanningSlot = {
  id: string;
  studentId: string;
  day: Weekday;
  time: string;
  subject: string;
  room?: string;
};
