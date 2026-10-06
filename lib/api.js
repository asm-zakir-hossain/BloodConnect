/* ============================================================
   FRONTEND API SERVICE — lib/api.js
   ============================================================
   
   📚 PURPOSE
   Centralized module for connecting the Next.js frontend to the FastAPI backend.
   ============================================================ */

import { getToken } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

// ------------------------------------------------------------------
// 1. AUTHENTICATION ENDPOINTS
// ------------------------------------------------------------------

export async function registerUser(userData) {
  return fetchAPI("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function loginUser(credentials) {
  return fetchAPI("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

// ------------------------------------------------------------------
// 2. DONOR DISCOVERY & SEARCH ENDPOINTS
// ------------------------------------------------------------------

export async function searchDonors({ bloodGroup = "ALL", division = "", district = "", area = "", university = "", showUnavailable = false, page = 1, pageSize = 12 }) {
  const params = new URLSearchParams();
  if (bloodGroup && bloodGroup !== "ALL") params.append("blood_group", bloodGroup);
  if (division) params.append("division", division);
  if (district) params.append("district", district);
  if (area) params.append("area", area);
  if (university) params.append("university", university);
  if (showUnavailable) params.append("show_unavailable", "true");
  params.append("page", String(page));
  params.append("page_size", String(pageSize));

  const queryStr = params.toString() ? `?${params.toString()}` : "";
  return fetchAPI(`/api/donors/search${queryStr}`);
}

export async function getDonorProfile(donorId) {
  return fetchAPI(`/api/donors/${donorId}`);
}

export async function getMyProfile() {
  return fetchAPI("/api/donors/me");
}

// ------------------------------------------------------------------
// 3. DONATION LOGGING ENDPOINTS
// ------------------------------------------------------------------

export async function logDonation(donationData) {
  return fetchAPI("/api/donors/me/log-donation", {
    method: "POST",
    body: JSON.stringify(donationData),
  });
}
