/* ============================================================
   DONOR DASHBOARD & LOG DONATION — app/profile/me/page.js
   ============================================================
   
   📚 PURPOSE
   Allows a registered donor to view their private dashboard, manage availability,
   and log new blood donations.
   
   📚 90-DAY RULE CALCULATION (PRD 5.4)
   When a user submits a donation date:
   1. nextEligibleDate = donationDate + 90 days
   2. isAvailable = (currentDate >= nextEligibleDate)
   3. Visual progress bar shows how many days remain in cooldown.
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./dashboard.module.css";
import { getMyProfile, logDonation } from "@/lib/api";
import { isLoggedIn, clearSession } from "@/lib/auth";

export default function DonorDashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [donationDateInput, setDonationDateInput] = useState("");
  const [locationNoteInput, setLocationNoteInput] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [logError, setLogError] = useState("");

  /* ---- LOAD THE LOGGED-IN DONOR'S PROFILE ---- */
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }

    getMyProfile()
      .then(setProfile)
      .catch((err) => setLoadError(err.message || "Failed to load your profile."))
      .finally(() => setIsLoadingProfile(false));
  }, [router]);

  const handleLogOut = () => {
    clearSession();
    router.push("/login");
  };

  /* ---- LOG DONATION HANDLER ---- */
  const handleLogDonation = async (e) => {
    e.preventDefault();
    if (!donationDateInput) return;

    setIsLogging(true);
    setLogError("");

    try {
      const updated = await logDonation({
        donationDate: donationDateInput,
        locationNote: locationNoteInput || undefined,
      });
      setProfile(updated);
      setSuccessMsg("Donation logged successfully! Availability status updated.");
      setDonationDateInput("");
      setLocationNoteInput("");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setLogError(err.message || "Failed to log donation. Please try again.");
    } finally {
      setIsLogging(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className={styles.page}>
        <div className="container">Loading your dashboard...</div>
      </div>
    );
  }

  if (loadError || !profile) {
    return (
      <div className={styles.page}>
        <div className="container">
          <p>{loadError || "Could not load your profile."}</p>
          <Link href="/login" className="btn btn-primary btn-sm">
            Log In Again
          </Link>
        </div>
      </div>
    );
  }

  /* Calculate progress percentage if in cooldown */
  let cooldownProgressPercent = 100;
  let daysRemaining = 0;

  if (!profile.isAvailable && profile.lastDonationDate && profile.nextEligibleDate) {
    const start = new Date(profile.lastDonationDate).getTime();
    const end = new Date(profile.nextEligibleDate).getTime();
    const today = new Date().getTime();

    const totalDuration = end - start;
    const elapsed = today - start;

    cooldownProgressPercent = Math.min(
      100,
      Math.max(0, Math.round((elapsed / totalDuration) * 100))
    );
    daysRemaining = Math.max(
      0,
      Math.ceil((end - today) / (1000 * 60 * 60 * 24))
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.dashboardHeader}>
          <div>
            <h1 className={styles.dashTitle}>Donor Dashboard</h1>
            <p className={styles.dashSubtitle}>
              Welcome back, <strong>{profile.name}</strong> ({profile.bloodGroup})
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link href={`/profile/${profile.id}`} className="btn btn-secondary btn-sm">
              View Public Profile
            </Link>
            <button onClick={handleLogOut} className="btn btn-ghost btn-sm">
              Log Out
            </button>
          </div>
        </div>

        {/* ---- AVAILABILITY & COOLDOWN CARD ---- */}
        <div className={styles.statusCard}>
          <div className={styles.statusHeader}>
            <div>
              <span className={styles.statusCardLabel}>Current Availability</span>
              <h2 className={styles.statusCardTitle}>
                {profile.isAvailable ? "Available to Donate" : "In 90-Day Cooldown Period"}
              </h2>
            </div>
            {profile.isAvailable ? (
              <span className="badge badge-available">Available Now</span>
            ) : (
              <span className="badge badge-unavailable">Unavailable</span>
            )}
          </div>

          {!profile.isAvailable && (
            <div className={styles.cooldownSection}>
              <div className={styles.cooldownRow}>
                <span>Cooldown Progress</span>
                <strong>{daysRemaining} days remaining</strong>
              </div>
              <div className={styles.progressBarBg}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${cooldownProgressPercent}%` }}
                ></div>
              </div>
              <p className={styles.cooldownNote}>
                Next eligible donation date: <strong>{profile.nextEligibleDate}</strong>
              </p>
            </div>
          )}
        </div>

        {/* ---- LOG DONATION FORM & HISTORY GRID ---- */}
        <div className={styles.gridContainer}>
          {/* LOG DONATION FORM */}
          <div className={styles.formCard}>
            <h3 className={styles.cardTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Log a Donation
            </h3>
            <p className={styles.cardDesc}>
              Did you donate blood recently? Log the date to update your availability 
              and auto-start your 90-day recovery cooldown.
            </p>

            {successMsg && <div className={styles.successBanner} role="status">{successMsg}</div>}
            {logError && <div className={styles.errorBanner} role="alert">{logError}</div>}

            <form onSubmit={handleLogDonation}>
              <div className={styles.formGroup}>
                <label htmlFor="donationDate" className={styles.label}>
                  Donation Date <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  id="donationDate"
                  value={donationDateInput}
                  onChange={(e) => setDonationDateInput(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="locationNote" className={styles.label}>
                  Hospital / Blood Bank Note (Optional)
                </label>
                <input
                  type="text"
                  id="locationNote"
                  placeholder="e.g. Square Hospital, Dhaka"
                  value={locationNoteInput}
                  onChange={(e) => setLocationNoteInput(e.target.value)}
                  className={styles.input}
                />
              </div>

              <button
                type="submit"
                className={`btn btn-primary ${styles.submitBtn}`}
                disabled={isLogging}
              >
                {isLogging ? "Updating Availability..." : "Log Donation & Update Status"}
              </button>
            </form>
          </div>

          {/* DONATION HISTORY SUMMARY */}
          <div className={styles.historyCard}>
            <h3 className={styles.cardTitle}>Donation History</h3>
            <div className={styles.historyStats}>
              <div className={styles.statBox}>
                <span className={styles.statNumber}>{profile.totalDonations}</span>
                <span className={styles.statLabel}>Lifetime Donations</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNumber}>
                  {profile.lastDonationDate || "N/A"}
                </span>
                <span className={styles.statLabel}>Last Donated</span>
              </div>
            </div>

            <p className={styles.historyNote}>
              Your full donation log builds trust on your public profile while 
              keeping exact dates private to protect your medical details.
            </p>
          </div>
        </div>
      </div>

      {/* ---- PERSISTENT LAST-DONATION TOAST ---- */}
      {profile && (
        <div className={styles.donationToast} role="status">
          {profile.lastDonationDate ? (
            <>You last donated blood on <strong>{profile.lastDonationDate}</strong>.
            {profile.nextEligibleDate
              ? ` Next eligible: ${profile.nextEligibleDate}.`
              : " You are eligible to donate again."}</>
          ) : (
            "You haven't logged a blood donation yet. Log your first donation below!"
          )}
        </div>
      )}
    </div>
  );
}
