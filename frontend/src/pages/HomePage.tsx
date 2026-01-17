"use client";

import React, { useEffect, useState } from "react";
import { PlanningPage } from "./PlanningPage";
import { listStudents } from "../services/students";
import type { Student } from "../data/models/Student";

export function HomePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    listStudents()
      .then((s) => setStudents(s))
      .catch((e) => {
        console.error("Failed to load students", e);
        setStudents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const current = students[index];

  return (
    <div style={{ maxWidth: 960, margin: "18px auto", padding: "0 12px" }}>
      <h2>Planning</h2>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <button onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index <= 0}>
          ◀
        </button>

        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ opacity: 0.7 }}>Loading students…</div>
          ) : (
            <div style={{ fontSize: 16 }}>{current ? `${current.firstName} ${current.lastName}` : "No student"}</div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setIndex((i) => Math.min(students.length - 1, i + 1))} disabled={index >= students.length - 1}>
            ▶
          </button>
        </div>
      </div>

      <PlanningPage studentId={current?.id} />
    </div>
  );
}
