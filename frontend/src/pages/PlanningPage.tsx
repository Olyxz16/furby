import { useEffect, useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { DataTable, type Column } from "../components/ui/DataTable";
import { Select, type SelectOption } from "../components/ui/Select";
import type { Student } from "../data/models/Student";
import { studentFullName } from "../data/models/Student";
import type { PlanningSlot } from "../data/models/Planning";
import { listStudents } from "../services/students";
import { listPlanningSlots } from "../services/planning";

type StudentId = string;

const columns: Column<PlanningSlot>[] = [
  { key: "day", header: "Day" },
  { key: "time", header: "Time" },
  { key: "subject", header: "Subject" },
  { key: "room", header: "Room", render: (r) => r.room ?? "-" },
  { key: "updatedAt", header: "Updated" }
];

export function PlanningPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState<StudentId | null>(null);
  const [slots, setSlots] = useState<PlanningSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listStudents().then((s) => {
      setStudents(s);
      if (!studentId && s.length > 0) setStudentId(s[0].id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    listPlanningSlots(studentId)
      .then(setSlots)
      .finally(() => setLoading(false));
  }, [studentId]);

  const studentOptions: SelectOption<StudentId>[] = useMemo(
    () =>
      students.map((s) => ({
        value: s.id,
        label: studentFullName(s)
      })),
    [students]
  );

  const currentStudent = useMemo(
    () => students.find((s) => s.id === studentId) ?? null,
    [students, studentId]
  );

  return (
    <Card
      title="Planning"
      right={
        <span style={{ fontSize: 12, opacity: 0.75 }}>
          {currentStudent ? studentFullName(currentStudent) : "No student"}
        </span>
      }
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ minWidth: 280 }}>
          <Select
            options={studentOptions}
            value={studentId}
            onChange={setStudentId}
            placeholder="Select a student…"
          />
        </div>
        {loading && <span style={{ fontSize: 12, opacity: 0.7 }}>Loading…</span>}
      </div>

      <DataTable columns={columns} rows={slots} rowKey={(r) => r.id} />
    </Card>
  );
}
