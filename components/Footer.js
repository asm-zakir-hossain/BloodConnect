/* ============================================================
   FOOTER COMPONENT — components/Footer.js
   ============================================================
   
   📚 PURPOSE
   The footer appears at the bottom of every page (via layout.js).
   It typically contains:
   - Navigation links (organized by category)
   - Contact info
   - Copyright notice
   - Social media links
   
   📚 SEMANTIC HTML
   We use <footer> (not <div>) because it's semantically meaningful.
   Screen readers announce "footer" to blind users so they know
   they've reached the bottom of the page content.
   ============================================================ */

"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

import { useSyncExternalStore } from "react";
import { isLoggedIn } from "@/lib/auth";

function subscribeToAuthChanges(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener("auth-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("auth-change", callback);
  };
}

function getServerAuthSnapshot() {
  return false;
}

function useAuthLoggedIn() {
  return useSyncExternalStore(subscribeToAuthChanges, isLoggedIn, getServerAuthSnapshot);
}


export default function Footer() {
  const loggedIn = useAuthLoggedIn();
  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* 
          TOP SECTION: Logo + link columns
          Uses CSS Grid to create a multi-column layout.
        */}
        <div className={styles.footerTop}>
          {/* ---- BRAND COLUMN ---- */}
          <div className={styles.footerBrand}>
            {/* Same logo as navbar */}
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2C16 2 6 14 6 20C6 25.5228 10.4772 30 16 30C21.5228 30 26 25.5228 26 20C26 14 16 2 16 2Z" fill="#DC3545"/>
                  <path d="M16 22C16 22 12 19.5 12 17.5C12 16.5 13 15.5 14 16.5L16 18.5L18 16.5C19 15.5 20 16.5 20 17.5C20 19.5 16 22 16 22Z" fill="white"/>
                </svg>
              </div>
              <span className={styles.logoText}>
                Blood<span className={styles.logoHighlight}>Connect</span>
              </span>
            </Link>
            <p className={styles.brandDesc}>
              Connecting blood donors with recipients across Bangladesh. 
              Find eligible donors instantly, save lives effortlessly.
            </p>
          </div>

          {/* ---- LINK COLUMNS ----
            Organized by category: Platform, Support, Legal.
            This is a standard footer pattern.
          */}
          <div className={styles.footerLinks}>
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Platform</h4>
              <Link href="/search" className={styles.footerLink}>Find Donors</Link>
              {!loggedIn && <Link href="/register" className={styles.footerLink}>Register as Donor</Link>}
              <Link href="/about" className={styles.footerLink}>How It Works</Link>
            </div>

          </div>
        </div>

        {/* 
          DIVIDER LINE
          A simple horizontal line separating the links from copyright.
        */}
        <div className={styles.divider}></div>

        {/* 
          BOTTOM SECTION: Copyright + social links
          
          📚 new Date().getFullYear()
          This JavaScript expression returns the current year (2026).
          So the copyright always shows the correct year automatically
          — no manual updating needed each January!
        */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} BloodConnect. All rights reserved. 
            Built with ❤️ for Bangladesh.
          </p>
        </div>
      </div>
    </footer>
  );
}
