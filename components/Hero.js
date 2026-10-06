/* ============================================================
   HERO SECTION — components/Hero.js
   ============================================================
   
   📚 WHAT IS A HERO SECTION?
   The "hero" is the very first section visitors see when they
   land on your website. It's the BIG section at the top with:
   - A compelling headline
   - A description of what the platform does
   - Call-to-action (CTA) buttons
   
   It's called "hero" because it's the HERO of the page —
   it makes the first impression and decides if visitors stay.
   
   📚 THIS IS A SERVER COMPONENT (no "use client")
   This component has NO interactive state (no useState, no onClick).
   It's pure static content — text, images, links.
   So it can be a Server Component, which is FASTER because:
   - It renders on the server (better SEO — Google can read it)
   - Less JavaScript sent to the browser = faster page load
   ============================================================ */

"use client";

import Link from "next/link";
import styles from "./Hero.module.css";

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


export default function Hero() {
  const loggedIn = useAuthLoggedIn();
  return (
    /* 
      <section> — semantic HTML tag meaning "a thematic section"
      Using semantic tags (section, article, nav, main, header, footer)
      instead of generic <div> helps:
      1. Screen readers understand the page structure
      2. Google's crawler understands content hierarchy
      3. Code is more readable
    */
    <section className={styles.hero}>
      {/* 
        Decorative background elements
        These are purely visual — colored blobs that create a subtle
        gradient/glow effect behind the content. They have no text
        content, just CSS-styled shapes.
      */}
      <div className={styles.heroBg}>
        <div className={styles.bgBlob1}></div>
        <div className={styles.bgBlob2}></div>
        <div className={styles.bgBlob3}></div>
      </div>

      <div className={`container ${styles.heroContent}`}>
        {/* 
          BADGE / LABEL
          A small tag above the headline that draws attention.
          "Trusted by 1000+ donors" builds credibility immediately.
        */}
        <div className={styles.heroBadge}>
          <span className={styles.badgeDot}></span>
          Connecting Lives Across Bangladesh
        </div>

        {/* 
          MAIN HEADLINE
          <h1> = the most important heading on the page.
          SEO Rule: Every page should have exactly ONE <h1>.
          
          We break the text into parts so we can style "Blood Donors"
          differently (in red) for visual emphasis.
        */}
        <h1 className={styles.heroTitle}>
          Find Eligible <span className={styles.highlight}>Blood Donors</span> Near You — In Seconds
        </h1>

        {/* 
          SUBTITLE / DESCRIPTION
          Explains what the platform does in plain language.
          <p> = paragraph tag.
        */}
        <p className={styles.heroSubtitle}>
          No more searching through Facebook groups or WhatsApp threads. 
          BloodConnect shows you real-time available donors by blood group 
          and location, with automatic eligibility tracking.
        </p>

        {/* 
          CTA (Call to Action) BUTTONS
          Two buttons side by side:
          1. Primary (red): "Find a Donor" — the main action
          2. Secondary (outlined): "Register as Donor" — the secondary action
          
          📚 WHY TWO BUTTONS?
          Different visitors have different goals:
          - Someone in need → "Find a Donor" (urgency)
          - Someone who wants to help → "Register as Donor"
          Having both catches both user types immediately.
        */}
        <div className={styles.heroCTA}>
          <Link href="/search" className={`btn btn-primary btn-lg ${styles.ctaPrimary}`}>
            {/* SVG search icon inline — small and crisp at any size */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            Find a Donor
          </Link>
          {!loggedIn && (
            <Link href="/register" className={`btn btn-secondary btn-lg ${styles.ctaSecondary}`}>
              Register as Donor
            </Link>
          )}
        </div>

        {/* 
          TRUST INDICATORS
          Small stats that build trust and credibility.
          Visitors are more likely to use a platform that others trust.
        */}
        <div className={styles.trustRow}>
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>1,200+</span>
            <span className={styles.trustLabel}>Registered Donors</span>
          </div>
          <div className={styles.trustDivider}></div>
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>8</span>
            <span className={styles.trustLabel}>Blood Groups</span>
          </div>
          <div className={styles.trustDivider}></div>
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>64</span>
            <span className={styles.trustLabel}>Districts Covered</span>
          </div>
        </div>
      </div>
    </section>
  );
}
