import type { Student } from "../data/models/Student";
import { students as mock } from "../data/mock/students";

export async function listStudents(): Promise<Student[]> {
  return mock;
}
