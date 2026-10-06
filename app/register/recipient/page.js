"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../register.module.css";
import { divisions, getDistrictsByDivision } from "@/data/locations";
import { registerUser } from "@/lib/api";
import { setSession } from "@/lib/auth";

export default function RecipientRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    division: "",
    district: "",
    area: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "division" ? { district: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await registerUser({
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: "recipient",
        division: formData.division,
        district: formData.district,
        area: formData.area,
      });
      setSession(response.accessToken, response.donor);
      router.push("/search");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.formContainer}>
          <h1 className={styles.formTitle}>Register to Find Donors</h1>
          <p className={styles.formSubtitle}>
            Not a donor? Create a free account to search for donors in your area.
          </p>

          {error && <div className={styles.errorBanner} role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Full Name *</label>
              <input id="name" name="name" value={formData.name} onChange={handleChange} required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>Phone Number *</label>
              <input id="phone" name="phone" value={formData.phone} onChange={handleChange} required className={styles.input} placeholder="01XXXXXXXXX" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password *</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required minLength={8} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>Confirm Password *</label>
              <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required minLength={8} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="division" className={styles.label}>Division *</label>
              <select id="division" name="division" value={formData.division} onChange={handleChange} required className={styles.input}>
                <option value="">Select Division</option>
                {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="district" className={styles.label}>District *</label>
              <select id="district" name="district" value={formData.district} onChange={handleChange} required className={styles.input} disabled={!formData.division}>
                <option value="">Select District</option>
                {formData.division && getDistrictsByDivision(formData.division).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="area" className={styles.label}>Area</label>
              <input id="area" name="area" value={formData.area} onChange={handleChange} className={styles.input} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p style={{ marginTop: "1rem" }}>
            Want to donate blood? <Link href="/register">Register as a Donor</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
