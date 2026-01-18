import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { DataTable, type Column } from "../components/ui/DataTable";
import type { PlanningSlot } from "../data/models/Planning";
import { listPlanningSlots } from "../services/planning";
import { planningSlots as mockSlots } from "../data/mock/planning";


const columns: Column<PlanningSlot>[] = [
  { key: "day", header: "Day" },
  { key: "time", header: "Time" },
  { key: "subject", header: "Subject" },
  { key: "room", header: "Room", render: (r) => r.room ?? "-" },
];

export function PlanningPage({ studentId }: { studentId?: string } = {}) {
  const [slots, setSlots] = useState<PlanningSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    if (studentId) {
      const filtered = mockSlots.filter((s) => s.studentId === studentId);
      setSlots(filtered);
      setLoading(false);
      setError(null);
      return;
    }

    listPlanningSlots()
      .then(setSlots)
      .catch((e) => {
        console.error(e);
        setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  const userMail = typeof window !== "undefined" ? localStorage.getItem("userMail") : null;

  return (
  <Card title="Planning">
    {loading && <div>Loading…</div>}
    {error && <div style={{ color: "red" }}>{error}</div>}

    {!loading && !error && (
      <DataTable columns={columns} rows={slots} rowKey={(r) => r.id} />
    )}
  </Card>
);
}
