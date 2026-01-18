"use client";

import React, { useState } from "react";
import { login, signin } from "../services/auth";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function submit() {
    setError(null);
    try {
      if (mode === "login") {
        await login(mail, password);
      } else {
        await signin(mail, password);
      }
      navigate("/");
    } catch {
      setError("Invalid email or password");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>{mode === "login" ? "Login" : "Create account"}</h2>

      <input value={mail} onChange={e => setMail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

      <button onClick={submit}>
        {mode === "login" ? "Login" : "Create account"}
      </button>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <button onClick={() => setMode(mode === "login" ? "signup" : "login")}>
        {mode === "login" ? "Create account" : "Already have an account?"}
      </button>
    </div>
  );
}
