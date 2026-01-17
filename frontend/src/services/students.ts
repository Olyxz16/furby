import type { Student } from "../data/models/Student";
import { apiFetch } from "./api";

type StudentDto = { id: string; firstName: string; lastName: string };

export async function listStudents(): Promise<Student[]> {
  const dto = await apiFetch<StudentDto[]>("/students");
  return (dto || []).map((s) => ({ id: String(s.id), firstName: s.firstName || '', lastName: s.lastName || '' }));
}
