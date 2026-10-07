/* ============================================================
   DONOR CARD COMPONENT — components/DonorCard.js
   ============================================================
   
   📚 PURPOSE
   Displays an individual donor profile summary in the search results list.
   
   📚 PROPS (PROPERTIES)
   Props are how parent components pass data down to child components.
   Here, <DonorCard donor={donorObject} /> receives a single `donor` object.
   ============================================================ */

"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./DonorCard.module.css";
import { formatDateLong } from "@/lib/formatDate";

export default function DonorCard({ donor }) {
  /*
    State for revealing phone numbers.
    The backend already enforces visibility — donor.phone is only present
    here when we're allowed to see it (public, or the viewer is logged in).
  */
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);

  return (
    <div
      className={`${styles.card} ${
        !donor.isAvailable ? styles.cardUnavailable : ""
      }`}
    >
      {/* ---- HEADER: Blood Group Badge + Availability Status ---- */}
      <div className={styles.cardHeader}>
        <div className={styles.bloodBadge}>{donor.bloodGroup}</div>

        <div className={styles.statusGroup}>
          {donor.isAvailable ? (
            <span className="badge badge-available">
              <span className={styles.dotAvailable}></span>
              Available Now
            </span>
          ) : (
            <span className="badge badge-unavailable">
              Eligible on {donor.nextEligibleDate}
            </span>
          )}
        </div>
      </div>

      {/* ---- DONOR INFO ---- */}
      <div className={styles.cardBody}>
        <div className={styles.nameRow}>
          <h3 className={styles.donorName}>{donor.name}</h3>
        </div>

        {/* Location Info */}
        <p className={styles.locationInfo}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {donor.area}, {donor.district}, {donor.division}
        </p>
        {donor.university && (
          <p className={styles.locationInfo}>🎓 {donor.university}</p>
        )}

        {/* Stats Row */}
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <strong>{donor.totalDonations}</strong> donations completed
          </span>
          {donor.lastDonationDate && (
            <span className={styles.metaItem}>
              Last: {formatDateLong(donor.lastDonationDate)}
            </span>
          )}
        </div>
      </div>

      {/* ---- FOOTER / CONTACT CTA ---- */}
      <div className={styles.cardFooter}>
        {donor.phone ? (
          isPhoneRevealed ? (
            <a
              href={`tel:${donor.phone}`}
              className={`btn btn-primary ${styles.callBtn}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Call: {donor.phone}
            </a>
          ) : (
            <button
              onClick={() => setIsPhoneRevealed(true)}
              className={`btn btn-secondary ${styles.revealBtn}`}
            >
              Click to Show Phone Number
            </button>
          )
        ) : (
          <Link href="/login" className={`btn btn-secondary ${styles.revealBtn}`}>
            Log In to View Phone Number
          </Link>
        )}
      </div>
    </div>
  );
}
