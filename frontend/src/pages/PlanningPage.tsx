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
    <Card
      title="Planning"
      right={<span style={{ fontSize: 12, opacity: 0.75 }}>{userMail ?? "Guest"}</span>}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
        {loading && <span style={{ fontSize: 12, opacity: 0.7 }}>Loading…</span>}
        {error && (
          <div style={{ color: "#b32525", fontSize: 13 }}>
            Failed to load agenda from API: {error}
            <div style={{ marginTop: 8 }}>
              <button
                onClick={() => {
                  setSlots(mockSlots);
                  setError(null);
                }}
                style={{ padding: "6px 10px", fontSize: 13 }}
              >
                Use mock data
              </button>
            </div>
          </div>
        )}
      </div>

      <DataTable columns={columns} rows={slots} rowKey={(r) => r.id} />
    </Card>
  );
}
