"use client";

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiFetch } from "./services/api";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    console.log("Checking session…");

    apiFetch("/auth/session")
      .then((res) => {
        console.log("CONNECTED / SESSION OK", res);
        setLogged(true);
      })
      .catch((err) => {
        console.log("NOT CONNECTED / NO SESSION");
        console.error(err);
        setLogged(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;
  if (!logged) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
