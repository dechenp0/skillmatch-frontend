// One place for every request to Django.
// - credentials: "include" sends and receives the session cookie across ports.
// - Unsafe methods (POST, PUT, DELETE) must carry the CSRF token in the X-CSRFToken header.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getCookie(name) {
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

async function getCsrfToken() {
  let token = getCookie("csrftoken");
  if (!token) {
    // First visit: ask Django to set the csrftoken cookie
    await fetch(`${API_URL}/api/auth/csrf/`, { credentials: "include" });
    token = getCookie("csrftoken");
  }
  return token;
}

export async function apiFetch(path, { method = "GET", body } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (method !== "GET") headers["X-CSRFToken"] = await getCsrfToken();

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // some responses (like 204 No Content) have no body
  }

  if (!res.ok) {
    const error = new Error(data?.detail || "Request failed");
    error.status = res.status;
    error.data = data; // field errors from Django, e.g. { email: ["..."] }
    throw error;
  }
  return data;
}