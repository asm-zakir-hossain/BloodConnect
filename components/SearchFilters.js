/* ============================================================
   SEARCH FILTERS COMPONENT — components/SearchFilters.js
   ============================================================
   
   📚 PURPOSE
   Provides interactive search controls (Blood Group, Division, District, Availability).
   ============================================================ */

"use client";

import { divisions, getDistrictsByDivision } from "@/data/locations";
import styles from "./SearchFilters.module.css";

const BLOOD_GROUPS = ["ALL", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function SearchFilters({
  filters,
  onFilterChange,
  onReset,
}) {
  const districts = filters.division
    ? getDistrictsByDivision(filters.division)
    : [];

  return (
    <div className={styles.filterCard}>
      <div className={styles.filterHeader}>
        <h3 className={styles.filterTitle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filter Donors
        </h3>
        <button onClick={onReset} className={styles.resetBtn}>
          Reset All
        </button>
      </div>

      {/* ---- 1. BLOOD GROUP SELECTOR ---- */}
      <div className={styles.filterGroup}>
        <span className={styles.filterLabel} id="blood-group-label">Blood Group</span>
        <div className={styles.bloodChipGrid} role="group" aria-labelledby="blood-group-label">
          {BLOOD_GROUPS.map((group) => (
            <button
              key={group}
              type="button"
              className={`${styles.chip} ${
                filters.bloodGroup === group ? styles.chipActive : ""
              }`}
              onClick={() => onFilterChange("bloodGroup", group)}
              aria-pressed={filters.bloodGroup === group}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* ---- 2. DIVISION DROPDOWN ---- */}
      <div className={styles.filterGroup}>
        <label htmlFor="search-division" className={styles.filterLabel}>
          Division
        </label>
        <select
          id="search-division"
          value={filters.division}
          onChange={(e) => onFilterChange("division", e.target.value)}
          className={styles.selectInput}
        >
          <option value="">All Divisions</option>
          {divisions.map((div) => (
            <option key={div} value={div}>
              {div}
            </option>
          ))}
        </select>
      </div>

      {/* ---- 3. DISTRICT DROPDOWN ---- */}
      <div className={styles.filterGroup}>
        <label htmlFor="search-district" className={styles.filterLabel}>
          District
        </label>
        <select
          id="search-district"
          value={filters.district}
          onChange={(e) => onFilterChange("district", e.target.value)}
          disabled={!filters.division}
          className={`${styles.selectInput} ${
            !filters.division ? styles.selectDisabled : ""
          }`}
        >
          <option value="">
            {filters.division ? "All Districts" : "Select Division First"}
          </option>
          {districts.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>
      </div>

      {/* ---- 4. TOGGLE UNAVAILABLE DONORS ---- */}
      <div className={styles.toggleGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={filters.showUnavailable}
            onChange={(e) =>
              onFilterChange("showUnavailable", e.target.checked)
            }
            className={styles.checkbox}
          />
          <span>Include currently unavailable donors (in 90-day cooldown)</span>
        </label>
      </div>
    </div>
  );
}
