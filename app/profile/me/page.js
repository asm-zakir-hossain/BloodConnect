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
import { getMyProfile, logDonation, updateMyProfile } from "@/lib/api";
import { isLoggedIn, clearSession, setSession } from "@/lib/auth";
import { formatDateLong } from "@/lib/formatDate";
import { divisions, getDistrictsByDivision } from "@/data/locations";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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

  /* ---- EDIT PERSONAL INFORMATION STATE ---- */
  const [showEditForm, setShowEditForm] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editSuccess, setEditSuccess] = useState("");
  const [editError, setEditError] = useState("");

  /* ---- LOAD THE LOGGED-IN DONOR'S PROFILE ---- */
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }

    getMyProfile()
      .then((data) => {
        if (data.role === "recipient") {
          router.replace("/search");
          return;
        }
        setProfile(data);
      })
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

  /* ---- OPEN EDIT FORM WITH CURRENT PROFILE ---- */
  const openEditForm = () => {
    setEditForm({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      bloodGroup: profile.bloodGroup || "",
      division: profile.division || "",
      district: profile.district || "",
      area: profile.area || "",
      dateOfBirth: profile.dateOfBirth || "",
      gender: profile.gender || "",
      university: profile.university || "",
      phoneVisibility: profile.phoneVisibility || "public",
    });
    setEditSuccess("");
    setEditError("");
    setShowEditForm(true);
  };

  /* ---- SAVE PERSONAL INFORMATION ---- */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setEditError("");
    try {
      const updated = await updateMyProfile({
        name: editForm.name,
        email: editForm.email || undefined,
        phone: editForm.phone || undefined,
        bloodGroup: editForm.bloodGroup || undefined,
        division: editForm.division,
        district: editForm.district,
        area: editForm.area,
        dateOfBirth: editForm.dateOfBirth || undefined,
        gender: editForm.gender || undefined,
        university: editForm.university || undefined,
        phoneVisibility: editForm.phoneVisibility,
      });
      setProfile(updated);
      const token = typeof window !== "undefined" ? localStorage.getItem("bloodconnect_token") : null;
      if (token) setSession(token, updated);
      setEditSuccess("Personal information updated successfully!");
      setTimeout(() => {
        setShowEditForm(false);
        setEditSuccess("");
      }, 2000);
    } catch (err) {
      setEditError(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
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
            <button
              onClick={() => (showEditForm ? setShowEditForm(false) : openEditForm())}
              className="btn btn-primary btn-sm"
            >
              {showEditForm ? "Cancel" : "Edit Profile"}
            </button>
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

        {/* ---- EDIT PERSONAL INFORMATION FORM ---- */}
        {showEditForm && editForm && (
          <div className={styles.formCard} style={{ marginBottom: "var(--space-8)" }}>
            <h3 className={styles.cardTitle}>Edit Personal Information</h3>
            <p className={styles.cardDesc}>
              Update any of your personal details below. Changes take effect immediately.
            </p>

            {editSuccess && <div className={styles.successBanner} role="status">{editSuccess}</div>}
            {editError && <div className={styles.errorBanner} role="alert">{editError}</div>}

            <form onSubmit={handleSaveProfile}>
              <div className={styles.gridContainer}>
                <div className={styles.formGroup}>
                  <label htmlFor="editName" className={styles.label}>Full Name</label>
                  <input
                    id="editName"
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editEmail" className={styles.label}>Email</label>
                  <input
                    id="editEmail"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editPhone" className={styles.label}>Phone Number</label>
                  <input
                    id="editPhone"
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editBloodGroup" className={styles.label}>Blood Group</label>
                  <select
                    id="editBloodGroup"
                    value={editForm.bloodGroup}
                    onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                    className={styles.input}
                  >
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editDivision" className={styles.label}>Division</label>
                  <select
                    id="editDivision"
                    value={editForm.division}
                    onChange={(e) => setEditForm({ ...editForm, division: e.target.value, district: "" })}
                    className={styles.input}
                  >
                    <option value="">Select division</option>
                    {divisions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editDistrict" className={styles.label}>District</label>
                  <select
                    id="editDistrict"
                    value={editForm.district}
                    onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                    className={styles.input}
                  >
                    <option value="">Select district</option>
                    {getDistrictsByDivision(editForm.division).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editArea" className={styles.label}>Area / Address</label>
                  <input
                    id="editArea"
                    type="text"
                    value={editForm.area}
                    onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editDob" className={styles.label}>Date of Birth</label>
                  <input
                    id="editDob"
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editGender" className={styles.label}>Gender</label>
                  <select
                    id="editGender"
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className={styles.input}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editUniversity" className={styles.label}>University</label>
                  <input
                    id="editUniversity"
                    type="text"
                    value={editForm.university}
                    onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editPhoneVisibility" className={styles.label}>Phone Visibility</label>
                  <select
                    id="editPhoneVisibility"
                    value={editForm.phoneVisibility}
                    onChange={(e) => setEditForm({ ...editForm, phoneVisibility: e.target.value })}
                    className={styles.input}
                  >
                    <option value="public">Public — visible to everyone</option>
                    <option value="logged_in_only">Logged-in users only</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className={`btn btn-primary ${styles.submitBtn}`}
                disabled={isSaving}
                style={{ marginTop: "var(--space-4)" }}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

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
                {donationDateInput && (
                  <span className={styles.helpText}>
                    Selected: {formatDateLong(donationDateInput)} — please confirm this is the correct day and month.
                  </span>
                )}
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
                  {profile.lastDonationDate ? formatDateLong(profile.lastDonationDate) : "N/A"}
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
            <>You last donated blood on <strong>{formatDateLong(profile.lastDonationDate)}</strong>.
            {profile.nextEligibleDate
              ? ` Next eligible: ${formatDateLong(profile.nextEligibleDate)}.`
              : " You are eligible to donate again."}</>
          ) : (
            "You haven't logged a blood donation yet. Log your first donation below, or find where to donate near you!"
          )}
        </div>
      )}
    </div>
  );
}
