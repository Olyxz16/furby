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
      {loading && <div>Loading students…</div>}

      {!loading && students.length === 0 && (
        <div>No students available.</div>
      )}

      {!loading && students.length > 0 && (
        <PlanningPage studentId={current?.id} />
      )}
    </div>
  );
}
