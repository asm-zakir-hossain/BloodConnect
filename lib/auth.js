/* ============================================================
   AUTH SESSION HELPER — lib/auth.js
   ============================================================

   Stores the JWT issued by the FastAPI backend (see lib/api.js)
   in localStorage so the browser stays "logged in" across page loads.
   ============================================================ */

const TOKEN_KEY = "bloodconnect_token";
const DONOR_KEY = "bloodconnect_donor";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredDonor() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(DONOR_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession(token, donor) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(DONOR_KEY, JSON.stringify(donor));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(DONOR_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}
