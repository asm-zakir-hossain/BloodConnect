/* ============================================================
   REGISTRATION PAGE — app/register/page.js
   ============================================================
   
   📚 WHAT IS THIS FILE?
   This is the donor registration page, mapped to the URL "/register".
   
   In Next.js App Router:
   app/register/page.js → URL: /register
   
   📚 HOW DOES THE FOLDER STRUCTURE CREATE ROUTES?
   When you create a folder inside "app/" and put a "page.js" inside it,
   Next.js automatically creates a route for that folder name.
   No configuration needed — this is "file-based routing."
   
   📚 "use client" — WHY?
   This page has a FORM with interactive features:
   - Input fields that the user types into (need state to track values)
   - Dropdown selects that change (need state)
   - Form submission handler (need event handling)
   - Validation (need to check values and show errors)
   All of these require browser APIs → must be a Client Component.
   
   📚 FORM STATE MANAGEMENT
   We use useState to create an object that holds ALL form fields.
   When any input changes, we update just that one field in the object.
   
   This pattern is called "controlled components" in React:
   - The React state is the "single source of truth"
   - Input values are controlled BY React, not by the browser
   - Every keystroke updates state → state updates the display
   ============================================================ */

"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./register.module.css";

/*
  📚 BANGLADESH LOCATION DATA
  
  Per the PRD (Section 5.3), location should be structured:
  Division → District → Area
  
  We import this from a separate data file (we'll create it next).
  This keeps the component file clean and the data reusable.
*/
import { divisions, getDistrictsByDivision } from "@/data/locations";
import { registerUser } from "@/lib/api";
import { formatDateLong } from "@/lib/formatDate";
import { setSession } from "@/lib/auth";

/*
  📚 BLOOD_GROUPS ARRAY
  The 8 standard blood types. Used to populate the dropdown.
  Defined here as a constant because it never changes.
*/
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: "Weak", level: 1 };
  if (score <= 2) return { label: "Fair", level: 2 };
  if (score <= 3) return { label: "Good", level: 3 };
  return { label: "Strong", level: 4 };
}

function PasswordStrength({ password }) {
  const { label, level } = getPasswordStrength(password);
  return (
    <div className={styles.strengthWrapper} aria-live="polite">
      <div className={styles.strengthBars}>
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={`${styles.strengthBar} ${n <= level ? styles[`strength${level}`] : ""}`}
          />
        ))}
      </div>
      <span className={styles.strengthLabel}>Password strength: {label}</span>
    </div>
  );
}

export default function RegisterPage() {
  /* ---- FORM STATE ----
    One state object holds ALL form field values.
    
    📚 WHY ONE OBJECT INSTEAD OF SEPARATE useState FOR EACH FIELD?
    With 8+ fields, writing useState 8 times gets messy:
      const [name, setName] = useState("");
      const [email, setEmail] = useState("");
      const [phone, setPhone] = useState("");
      ... (8 more times!)
    
    Instead, ONE object keeps everything organized:
      formData.name, formData.email, formData.phone, etc.
    
    We update individual fields using the "spread operator" (...):
      setFormData({ ...formData, name: "new value" })
      This means: "copy everything from formData, but change name"
  */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    bloodGroup: "",
    division: "",
    district: "",
    area: "",
    dateOfBirth: "",
    gender: "",
    lastDonationDate: "",
  });

  /* ---- ERROR STATE ----
    Stores validation error messages for each field.
    If errors.name has a value, we show it below the name input.
  */
  const [errors, setErrors] = useState({});

  /* ---- LOADING STATE ----
    true when the form is being submitted (shows a spinner).
    Prevents double-submissions.
  */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---- SUCCESS STATE ----
    true after successful registration. Shows a success message
    instead of the form.
  */
  const [isSuccess, setIsSuccess] = useState(false);

  /* ---- DISTRICTS LIST ----
    This list changes based on which division is selected.
    When division changes, we fetch the districts for that division.
  */
  const districts = formData.division
    ? getDistrictsByDivision(formData.division)
    : [];

  /* ============================================================
     📚 handleChange — THE INPUT CHANGE HANDLER
     ============================================================
     
     This function runs every time ANY input field changes.
     
     HOW IT WORKS:
     1. "e" is the "event" object — the browser creates this
        automatically whenever something happens (typing, clicking, etc.)
     
     2. e.target = the HTML element that triggered the event (the input)
     
     3. e.target.name = the "name" attribute of the input
        (we set name="email" on the email input, name="phone" on phone, etc.)
     
     4. e.target.value = what the user typed
     
     5. We use "computed property names" — [name]: value
        This means: use the VARIABLE "name" as the key.
        If name = "email", then [name] becomes email
        So { ...formData, [name]: value } = { ...formData, email: "typed value" }
     
     📚 WHY ONE HANDLER FOR ALL INPUTS?
     Instead of writing handleNameChange, handleEmailChange, etc.,
     we write ONE handler and use the input's "name" attribute
     to know WHICH field to update. Much cleaner!
  */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear the error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Special case: when division changes, reset district
    // (because the old district might not exist in the new division)
    if (name === "division") {
      setFormData((prev) => ({ ...prev, division: value, district: "" }));
    }
  };

  /* ============================================================
     📚 validateForm — FORM VALIDATION
     ============================================================
     
     Checks all required fields before submission.
     Returns true if valid, false if there are errors.
     
     📚 WHY CLIENT-SIDE VALIDATION?
     - Gives instant feedback (no waiting for server response)
     - Better UX (user sees errors immediately)
     - Reduces unnecessary API calls
     
     BUT: We'll ALSO validate on the server later (never trust
     client-side validation alone — users can bypass it).
  */
  const validateForm = () => {
    const newErrors = {};

    // Required field checks
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    // Email OR phone required (per updated PRD)
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = "Email or phone number is required";
      newErrors.phone = "Email or phone number is required";
    }

    // Email format check (if provided)
    if (formData.email.trim()) {
      /*
        📚 REGEX (Regular Expression) for email validation
        This pattern checks for: something@something.something
        
        /^...$/  = start and end of string
        [^\s@]+  = one or more characters that are NOT spaces or @
        @        = literal @ symbol
        \.       = literal dot
        
        This is a SIMPLE check — not perfect, but catches most typos.
        Full email validation is done server-side.
      */
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Minimum age check (18+)
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      if (isNaN(dob.getTime()) || dob > eighteenYearsAgo) {
        newErrors.dateOfBirth = "You must be at least 18 years old to register";
      }
    }

    // Bangladesh phone format check (if provided)
    if (formData.phone.trim()) {
      const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ""))) {
        newErrors.phone =
          "Please enter a valid Bangladeshi phone number (e.g. 01711002233)";
      }
    }

    // Password checks
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Blood group required
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = "Blood group is required";
    }

    // Location required
    if (!formData.division) {
      newErrors.division = "Division is required";
    }
    if (!formData.district) {
      newErrors.district = "District is required";
    }

    setErrors(newErrors);
    /*
      Object.keys(newErrors).length === 0 means:
      "the errors object has NO keys" → no errors → form is valid!
    */
    return Object.keys(newErrors).length === 0;
  };

  /* ============================================================
     📚 handleSubmit — FORM SUBMISSION
     ============================================================
     
     Called when the user clicks "Register."
     
     e.preventDefault() — CRITICAL:
     By default, HTML forms RELOAD the entire page when submitted.
     We don't want that in a React app (we'd lose all state!).
     preventDefault() stops that default behavior.
     
     For now, this just simulates a successful registration.
     Later, we'll connect it to the FastAPI backend.
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        bloodGroup: formData.bloodGroup,
        division: formData.division,
        district: formData.district,
        area: formData.area,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        lastDonationDate: formData.lastDonationDate || undefined,
      });
      setSession(response.accessToken, response.donor);
      setIsSuccess(true);
    } catch (error) {
      setErrors({ general: error.message || "Registration failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---- SUCCESS STATE UI ----
    After successful registration, show a success message.
    Per updated PRD: profile goes live IMMEDIATELY (no verification).
  */
  if (isSuccess) {
    return (
      <div className={styles.page}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className={styles.successTitle}>Welcome to BloodConnect!</h2>
          <p className={styles.successText}>
            Your profile is now <strong>live</strong> and searchable. 
            Donors in need of your blood type can now find you.
          </p>
          <p className={styles.successNote}>
            Your profile is marked as &quot;Unverified&quot; until you complete 
            optional verification steps.
          </p>
          <div className={styles.successActions}>
            <Link href="/search" className="btn btn-primary btn-lg">
              Find Donors
            </Link>
            <Link href="/" className="btn btn-ghost">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---- REGISTRATION FORM UI ---- */
  return (
    <div className={styles.page}>
      <div className={styles.formContainer}>
        {/* ---- FORM HEADER ---- */}
        <div className={styles.formHeader}>
          <h1 className={styles.formTitle}>Register as a Donor</h1>
          <p className={styles.formSubtitle}>
            Join thousands of lifesavers across Bangladesh. 
            Your profile will be live immediately after registration.
          </p>
        </div>

        {/* ---- GENERAL ERROR MESSAGE ---- */}
        {errors.general && (
          <div className={styles.errorBanner} role="alert">{errors.general}</div>
        )}

        {/* 
          📚 THE <form> TAG
          
          onSubmit={handleSubmit} — calls our handler when form is submitted.
          The form can be submitted by:
          1. Clicking the submit button
          2. Pressing Enter while focused on an input
          
          noValidate — disables browser's default validation popups.
          We use our OWN validation (validateForm) instead.
        */}
        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          {/* ============ PERSONAL INFO SECTION ============ */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Personal Information
            </h3>

            {/* Full Name */}
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            {/* Date of Birth */}
            <div className={styles.formGroup}>
              <label htmlFor="dateOfBirth" className={styles.label}>
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={styles.input}
              />
              {formData.dateOfBirth && (
                <span className={styles.helpText}>
                  Selected: {formatDateLong(formData.dateOfBirth)} — please confirm this is the correct day and month.
                </span>
              )}
            </div>

            {/* Gender */}
            <div className={styles.formGroup}>
              <label htmlFor="gender" className={styles.label}>
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Select gender (optional)</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* ============ ACCOUNT INFO SECTION ============ */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Account Information
            </h3>

            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              <span className={styles.helpText}>
                Either email or phone number is required for your account.
              </span>
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password <span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
              {formData.password && (
                <PasswordStrength password={formData.password} />
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password <span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
              />
              {errors.confirmPassword && (
                <span className={styles.errorText}>{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          {/* ============ DONOR INFO SECTION ============ */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Donor Information
            </h3>

            {/* Blood Group */}
            <div className={styles.formGroup}>
              <label htmlFor="bloodGroup" className={styles.label}>
                Blood Group <span className={styles.required}>*</span>
              </label>
              {/*
                📚 BLOOD GROUP SELECTOR — BUTTON GROUP PATTERN
                
                Instead of a boring dropdown, we use a grid of buttons.
                This is better UX because:
                1. All options are visible at once (no clicking to open dropdown)
                2. Visually distinctive — blood groups are color-coded
                3. Faster selection (one click vs two with dropdown)
                
                The selected button gets a special "active" style.
              */}
              <div className={styles.bloodGroupGrid}>
                {BLOOD_GROUPS.map((group) => (
                  <button
                    key={group}
                    type="button"
                    className={`${styles.bloodGroupBtn} ${
                      formData.bloodGroup === group ? styles.bloodGroupActive : ""
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, bloodGroup: group });
                      if (errors.bloodGroup) {
                        setErrors({ ...errors, bloodGroup: "" });
                      }
                    }}
                  >
                    {group}
                  </button>
                ))}
              </div>
              {errors.bloodGroup && (
                <span className={styles.errorText}>{errors.bloodGroup}</span>
              )}
            </div>

            {/* Last Donation Date (optional) */}
            <div className={styles.formGroup}>
              <label htmlFor="lastDonationDate" className={styles.label}>
                Last Donation Date
              </label>
              <input
                type="date"
                id="lastDonationDate"
                name="lastDonationDate"
                value={formData.lastDonationDate}
                onChange={handleChange}
                className={styles.input}
              />
              <span className={styles.helpText}>
                If you&apos;ve donated before, enter the date. We&apos;ll calculate your eligibility 
                (90-day cooldown rule).
              </span>
              {formData.lastDonationDate && (
                <span className={styles.helpText}>
                  Selected: {formatDateLong(formData.lastDonationDate)} — please confirm this is the correct day and month.
                </span>
              )}
            </div>
          </div>

          {/* ============ LOCATION SECTION ============ */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Location
            </h3>

            {/* Division Dropdown */}
            <div className={styles.formGroup}>
              <label htmlFor="division" className={styles.label}>
                Division <span className={styles.required}>*</span>
              </label>
              {/*
                📚 CASCADING DROPDOWNS
                
                When the user selects a Division, the District dropdown
                updates to show only districts within that division.
                
                This is handled by:
                1. Division changes → handleChange updates formData.division
                2. The "districts" variable recalculates using getDistrictsByDivision()
                3. React re-renders the District dropdown with new options
                
                This is called "derived state" — districts is automatically
                computed FROM the division selection.
              */}
              <select
                id="division"
                name="division"
                value={formData.division}
                onChange={handleChange}
                className={`${styles.input} ${errors.division ? styles.inputError : ""}`}
              >
                <option value="">Select division</option>
                {divisions.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
              {errors.division && (
                <span className={styles.errorText}>{errors.division}</span>
              )}
            </div>

            {/* District Dropdown (depends on Division) */}
            <div className={styles.formGroup}>
              <label htmlFor="district" className={styles.label}>
                District <span className={styles.required}>*</span>
              </label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!formData.division}
                className={`${styles.input} ${errors.district ? styles.inputError : ""} ${
                  !formData.division ? styles.inputDisabled : ""
                }`}
              >
                <option value="">
                  {formData.division ? "Select district" : "Select a division first"}
                </option>
                {districts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
              {errors.district && (
                <span className={styles.errorText}>{errors.district}</span>
              )}
            </div>

            {/* Area (optional) */}
            <div className={styles.formGroup}>
              <label htmlFor="area" className={styles.label}>
                Area / Neighborhood
              </label>
              <input
                type="text"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. Mirpur 10"
                className={styles.input}
              />
            </div>
          </div>

          {/* ============ CONSENT & SUBMIT ============ */}
          <div className={styles.formSection}>
            <p className={styles.consentText}>
              By registering, you agree that your name, blood group, and area 
              will be <strong>publicly visible</strong> to help those in need find donors.
              You can deactivate your profile anytime.
            </p>

            {/*
              📚 THE SUBMIT BUTTON
              
              type="submit" — tells the browser this button submits the form.
              When clicked (or Enter pressed), it triggers the form's onSubmit event.
              
              disabled={isSubmitting} — prevents double-clicking while submitting.
              The button also changes text to show "Creating Account..." feedback.
            */}
            <button
              type="submit"
              className={`btn btn-primary btn-lg ${styles.submitBtn}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Creating Account...
                </>
              ) : (
                "Register — Your Profile Goes Live Instantly"
              )}
            </button>

            <p className={styles.loginLink}>
              Already have an account?{" "}
              <Link href="/login" className={styles.link}>
                Log in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
