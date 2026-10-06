/* ============================================================
   LOGIN PAGE — app/login/page.js
   ============================================================
   
   📚 WHAT IS THIS FILE?
   The login page, mapped to URL "/login".
   Users enter their email/phone + password to access their account.
   
   📚 HOW IS THIS DIFFERENT FROM THE REGISTER PAGE?
   - Much simpler — only 2 fields (email/phone + password)
   - No validation for blood group, location, etc.
   - Links to "Forgot Password" (future feature)
   - Links to Register page for new users
   
   📚 FORM PATTERN: SAME AS REGISTER
   Same pattern: useState for form data, handleChange for updates,
   handleSubmit for submission, validation before API call.
   ============================================================ */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";
import { loginUser } from "@/lib/api";
import { setSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  /* Form state — only email/phone and password needed */
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---- handleChange ----
    Same pattern as register page.
    [name]: value uses the input's name attribute as the key.
  */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  /* ---- Validation ---- */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or phone number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---- Form Submission ---- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await loginUser({
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
      });
      setSession(response.accessToken, response.donor);
      router.push(response.donor?.role === "recipient" ? "/search" : "/profile/me");
    } catch (error) {
      setErrors({ general: error.message || "Invalid email/phone or password." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.loginCard}>
        {/* ---- LOGO ---- */}
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C16 2 6 14 6 20C6 25.5228 10.4772 30 16 30C21.5228 30 26 25.5228 26 20C26 14 16 2 16 2Z" fill="#DC3545"/>
              <path d="M16 22C16 22 12 19.5 12 17.5C12 16.5 13 15.5 14 16.5L16 18.5L18 16.5C19 15.5 20 16.5 20 17.5C20 19.5 16 22 16 22Z" fill="white"/>
            </svg>
          </div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            Log in to manage your donor profile and donation history.
          </p>
        </div>

        {/* ---- ERROR BANNER ---- */}
        {errors.general && (
          <div className={styles.errorBanner}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {errors.general}
          </div>
        )}

        {/* ---- LOGIN FORM ---- */}
        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          {/* Email or Phone */}
          <div className={styles.formGroup}>
            <label htmlFor="emailOrPhone" className={styles.label}>
              Email or Phone Number
            </label>
            <input
              type="text"
              id="emailOrPhone"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              placeholder="you@example.com or 01XXXXXXXXX"
              className={`${styles.input} ${errors.emailOrPhone ? styles.inputError : ""}`}
              autoComplete="email"
            />
            {errors.emailOrPhone && (
              <span className={styles.errorText}>{errors.emailOrPhone}</span>
            )}
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <Link href="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn btn-primary btn-lg ${styles.submitBtn}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* ---- REGISTER LINK ---- */}
        <div className={styles.registerSection}>
          <p className={styles.registerText}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className={styles.link}>
              Register as a Donor
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
