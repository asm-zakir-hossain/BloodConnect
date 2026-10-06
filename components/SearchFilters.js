/* ============================================================
   SEARCH FILTERS COMPONENT — components/SearchFilters.js
   ============================================================
   
   📚 PURPOSE
   Provides interactive search controls (Blood Group, Division, District, Availability).
   ============================================================ */

"use client";

import { useState } from "react";
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

  const [divisionQuery, setDivisionQuery] = useState("");
  const [districtQuery, setDistrictQuery] = useState("");

  const filteredDivisions = divisions.filter((d) =>
    d.toLowerCase().includes(divisionQuery.toLowerCase())
  );
  const filteredDistricts = districts.filter((d) =>
    d.toLowerCase().includes(districtQuery.toLowerCase())
  );

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
        <div className={styles.suggestionWrap}>
          <input
            type="text"
            placeholder="Type to search divisions..."
            value={divisionQuery}
            onChange={(e) => setDivisionQuery(e.target.value)}
            className={styles.selectInput}
            aria-label="Search divisions"
          />
          {divisionQuery && (
            <ul className={styles.suggestionList}>
              {filteredDivisions.map((div) => (
                <li
                  key={div}
                  className={styles.suggestionItem}
                  onClick={() => {
                    onFilterChange("division", div);
                    setDivisionQuery("");
                  }}
                >
                  {div}
                </li>
              ))}
            </ul>
          )}
        </div>
        <select
          id="search-division"
          value={filters.division}
          onChange={(e) => onFilterChange("division", e.target.value)}
          className={styles.selectInput}
        >
          <option value="">All Divisions</option>
          {filteredDivisions.map((div) => (
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
        <div className={styles.suggestionWrap}>
          <input
            type="text"
            placeholder="Type to search districts..."
            value={districtQuery}
            onChange={(e) => setDistrictQuery(e.target.value)}
            disabled={!filters.division}
            className={`${styles.selectInput} ${
              !filters.division ? styles.selectDisabled : ""
            }`}
            aria-label="Search districts"
          />
          {districtQuery && (
            <ul className={styles.suggestionList}>
              {filteredDistricts.map((dist) => (
                <li
                  key={dist}
                  className={styles.suggestionItem}
                  onClick={() => {
                    onFilterChange("district", dist);
                    setDistrictQuery("");
                  }}
                >
                  {dist}
                </li>
              ))}
            </ul>
          )}
        </div>
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
          {filteredDistricts.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>
      </div>

      {/* ---- 3b. AREA TEXT INPUT ---- */}
      <div className={styles.filterGroup}>
        <label htmlFor="search-area" className={styles.filterLabel}>
          Area
        </label>
        <input
          id="search-area"
          type="text"
          value={filters.area || ""}
          onChange={(e) => onFilterChange("area", e.target.value)}
          placeholder="e.g. Mirpur 10"
          className={styles.selectInput}
        />
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
