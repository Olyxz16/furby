export type Student = {
  id: string;
  firstName: string;
  lastName: string;
};

export function studentFullName(s: Student): string {
  return `${s.firstName} ${s.lastName}`;
}
