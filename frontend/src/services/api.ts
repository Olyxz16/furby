const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5173";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  const txt = await res.text();
  try {
    return txt ? JSON.parse(txt) : (null as unknown as T);
  } catch (e) {
    throw new Error("Failed to parse JSON response");
  }
}

export default BASE_URL;
