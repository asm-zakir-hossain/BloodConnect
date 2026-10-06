/* ============================================================
   FORGOT PASSWORD PAGE — app/forgot-password/page.js
   ============================================================ */

"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./forgot.module.css";

export default function ForgotPasswordPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Reset Your Password</h1>
        <p className={styles.subtitle}>
          Enter the email or phone number associated with your account and we
          will send you reset instructions.
        </p>

        {submitted ? (
          <div className={styles.successBanner} role="status">
            If an account exists for <strong>{emailOrPhone}</strong>, reset
            instructions have been sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="emailOrPhone" className={styles.label}>
              Email or Phone Number
            </label>
            <input
              type="text"
              id="emailOrPhone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="you@example.com or 01XXXXXXXXX"
              className={styles.input}
              required
            />
            <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`}>
              Send Reset Instructions
            </button>
          </form>
        )}

        <Link href="/login" className={styles.backLink}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}
