/* ============================================================
   BLOOD GROUP QUICK SEARCH — components/BloodGroupSearch.js
   ============================================================
   
   📚 PURPOSE
   This is a visual "quick search" section on the homepage.
   Instead of just text, we show clickable blood group cards
   that take users directly to search results for that blood type.
   
   📚 "use client" — WHY?
   We need hover/interactive effects managed through client-side
   rendering. Even though we could technically make this a server
   component, keeping it client-side gives us flexibility to add
   interactive features later (like showing donor count on hover).
   
   📚 BLOOD GROUPS
   There are 8 main blood groups (ABO + Rh factor):
   A+, A-, B+, B-, AB+, AB-, O+, O-
   
   The "+" or "-" refers to the Rh factor (a protein on red blood cells).
   O- is the "universal donor" (can donate to anyone).
   AB+ is the "universal recipient" (can receive from anyone).
   ============================================================ */

"use client";

import Link from "next/link";
import styles from "./BloodGroupSearch.module.css";

/*
  Each blood group has:
  - type: the blood group name
  - label: display name
  - description: a brief note about the blood type
  - rarity: how common it is in Bangladesh
*/
const bloodGroups = [
  { type: "O+", label: "O+", description: "Most Common", rarity: "~38%" },
  { type: "B+", label: "B+", description: "Very Common", rarity: "~28%" },
  { type: "A+", label: "A+", description: "Common", rarity: "~24%" },
  { type: "AB+", label: "AB+", description: "Less Common", rarity: "~5%" },
  { type: "O-", label: "O−", description: "Universal Donor", rarity: "~2%" },
  { type: "B-", label: "B−", description: "Rare", rarity: "~1.5%" },
  { type: "A-", label: "A−", description: "Rare", rarity: "~1%" },
  { type: "AB-", label: "AB−", description: "Rarest", rarity: "~0.5%" },
];

export default function BloodGroupSearch() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Quick Search</span>
          <h2 className="section-title">Search by Blood Group</h2>
          <p className="section-subtitle">
            Click on a blood group to find available donors instantly. 
            Each card shows the prevalence in Bangladesh.
          </p>
        </div>

        {/* 
          BLOOD GROUP GRID
          8 cards in a 4×2 grid (desktop) or 2×4 grid (mobile).
          
          Each card is a Link — clicking it navigates to 
          /search?blood_group=O+ (or whichever group was clicked).
          
          📚 QUERY PARAMETERS (?blood_group=O+)
          The part after "?" in a URL is called a "query string."
          It passes data to the next page without needing a form.
          The search page will read this value and pre-filter results.
          
          encodeURIComponent() converts special characters like "+"
          into URL-safe format (%2B), preventing URL parsing issues.
        */}
        <div className={styles.groupGrid}>
          {bloodGroups.map((group) => (
            <Link
              key={group.type}
              href={`/search?blood_group=${encodeURIComponent(group.type)}`}
              className={styles.groupCard}
            >
              <span className={styles.groupType}>{group.label}</span>
              <span className={styles.groupDesc}>{group.description}</span>
              <span className={styles.groupRarity}>{group.rarity}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
