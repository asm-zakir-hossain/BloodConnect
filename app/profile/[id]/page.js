/* ============================================================
   PUBLIC DONOR PROFILE PAGE — app/profile/[id]/page.js
   ============================================================
   
   📚 PURPOSE
   Displays a detailed public profile for a specific donor.
   URL: /profile/d1, /profile/d2, etc.
   
   📚 NEXT.JS DYNAMIC ROUTING
   Folder `app/profile/[id]/` creates a dynamic route.
   The `use(params)` hook or async params prop extracts the `id` from the URL.
   ============================================================ */

"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { getDonorProfile } from "@/lib/api";
import styles from "./profile.module.css";
import { formatDateLong } from "@/lib/formatDate";

export default function PublicProfilePage({ params }) {
  // Unwrap params using React.use() or await params in client/server components
  const resolvedParams = use(params);
  const donorId = resolvedParams.id;

  const [donor, setDonor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    let cancelled = false;

    getDonorProfile(donorId)
      .then((data) => {
        if (cancelled) return;
        setDonor(data);
        setLoadError("");
        setIsPhoneRevealed(false);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || "Donor not found.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [donorId]);

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSubmitted(false);
      setReportReason("");
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className="container">Loading donor profile...</div>
      </div>
    );
  }

  if (loadError || !donor) {
    return (
      <div className={styles.page}>
        <div className="container">
          <p>{loadError || "Donor not found."}</p>
          <Link href="/search" className={styles.backLink}>
            Back to Search Results
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Back link */}
        <Link href="/search" className={styles.backLink}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Search Results
        </Link>

        <div className={styles.profileCard}>
          {/* ---- HERO HEADER ---- */}
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div className={styles.bloodBadge}>{donor.bloodGroup}</div>
              <div>
                <div className={styles.nameRow}>
                  <h1 className={styles.donorName}>{donor.name}</h1>
                  <span className={styles.unverifiedTag} title="Unverified identity (PRD 5.5)">
                    Unverified
                  </span>
                </div>
                <p className={styles.locationText}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {donor.area}, {donor.district}, {donor.division}
                </p>
                {donor.university && (
                  <p className={styles.locationText}>🎓 {donor.university}</p>
                )}
                <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Profile link copied!");
                    }}
                  >
                    Copy Profile Link
                  </button>
                  <a
                    className="btn btn-primary btn-sm"
                    href={`https://wa.me/?text=${encodeURIComponent(`${donor.name} — ${donor.bloodGroup} donor on BloodConnect: ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Share on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Status Pill */}
            <div>
              {donor.isAvailable ? (
                <span className="badge badge-available">
                  <span className={styles.statusDot}></span>
                  Available Now
                </span>
              ) : (
                <span className="badge badge-unavailable">
                  Eligible on {donor.nextEligibleDate}
                </span>
              )}
            </div>
          </div>

          {/* ---- METRICS GRID ---- */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>{donor.totalDonations}</span>
              <span className={styles.metricLabel}>Total Donations</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>{donor.bloodGroup}</span>
              <span className={styles.metricLabel}>Blood Group</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>
                {donor.lastDonationDate ? formatDateLong(donor.lastDonationDate) : "None logged"}
              </span>
              <span className={styles.metricLabel}>Last Donated</span>
            </div>
          </div>

          {/* ---- CONTACT & CALL ACTION ---- */}
          <div className={styles.actionSection}>
            <h3 className={styles.sectionTitle}>Contact Donor</h3>
            {donor.phone ? (
              isPhoneRevealed ? (
                <a
                  href={`tel:${donor.phone}`}
                  className={`btn btn-primary btn-lg ${styles.callBtn}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Call {donor.phone}
                </a>
              ) : (
                <button
                  onClick={() => setIsPhoneRevealed(true)}
                  className="btn btn-secondary btn-lg"
                >
                  Click to Reveal Phone Number
                </button>
              )
            ) : (
              <Link href="/login" className="btn btn-secondary btn-lg">
                Log In to View Phone Number
              </Link>
            )}

            {/* Report Profile Button (PRD Trust & Safety 5.5) */}
            <div className={styles.reportRow}>
              <button
                onClick={() => setShowReportModal(true)}
                className={styles.reportBtn}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Report inaccurate info or unreachable number
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---- REPORT MODAL ---- */}
      {showReportModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            {reportSubmitted ? (
              <div className={styles.reportSuccess}>
                <div className={styles.checkIcon}>✓</div>
                <h3>Report Received</h3>
                <p>Thank you for keeping BloodConnect safe and reliable.</p>
              </div>
            ) : (
              <>
                <h3 className={styles.modalTitle}>Report Donor Profile</h3>
                <p className={styles.modalSubtitle}>
                  Please specify why you are reporting {donor.name}&apos;s profile:
                </p>

                <form onSubmit={handleReportSubmit}>
                  <textarea
                    className={styles.reportTextarea}
                    rows="4"
                    placeholder="e.g. Phone number is unreachable, wrong blood group, or donor requested commercial payment..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    required
                  ></textarea>

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      onClick={() => setShowReportModal(false)}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Submit Report
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
