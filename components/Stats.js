/* ============================================================
   STATS SECTION — components/Stats.js
   ============================================================
   
   📚 PURPOSE
   A visually striking section that highlights platform impact
   through numbers. People trust numbers more than words.
   
   This section uses a red gradient background to break up the
   white/gray pattern of the page and create visual contrast.
   
   📚 DESIGN PRINCIPLE: CONTRAST SECTIONS
   Alternating between light and colored sections:
   - Prevents "wall of white" fatigue
   - Creates natural visual breaks
   - Guides the eye down the page
   - Makes each section feel distinct
   ============================================================ */

import styles from "./Stats.module.css";

const stats = [
  {
    id: 1,
    number: "1,200+",
    label: "Registered Donors",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 2,
    number: "500+",
    label: "Lives Saved",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    id: 3,
    number: "64",
    label: "Districts Covered",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    id: 4,
    number: "24/7",
    label: "Always Available",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

export default function Stats() {
  return (
    /* 
      This section has a gradient red background (defined in CSS).
      All text inside is white to contrast against the red.
    */
    <section className={styles.section}>
      <div className={`container ${styles.statsContainer}`}>
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.id} className={styles.statItem}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
