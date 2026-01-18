import { apiFetch } from "./api";

export async function login(mail: string, password: string): Promise<void> {
  await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ mail, password }),
  });
}

export async function signin(mail: string, password: string) {
  return apiFetch("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ mail, password }),
  });
}

export async function logout(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
}
