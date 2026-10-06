/* ============================================================
   NAVBAR COMPONENT — components/Navbar.js
   ============================================================
   
   📚 WHAT IS A COMPONENT?
   A component is a reusable piece of UI. Instead of writing the
   navbar HTML on every page, we write it ONCE here and import it.
   
   📚 "use client" — WHAT DOES THIS MEAN?
   Next.js has two types of components:
   
   1. SERVER COMPONENTS (default): Run on the server, can't use
      browser features like useState, onClick, window, etc.
      Good for: static content, data fetching.
   
   2. CLIENT COMPONENTS ("use client"): Run in the browser.
      CAN use useState, onClick, and all interactive features.
      Good for: buttons, forms, animations, anything interactive.
   
   Our Navbar needs a mobile menu toggle (useState + onClick),
   so it MUST be a client component.
   
   📚 WHY useState?
   useState is a React "hook" — a special function that lets us
   store and update data that can change over time (called "state").
   
   Here we use it to track if the mobile menu is open or closed:
   - isMobileMenuOpen = the current value (true or false)
   - setIsMobileMenuOpen = the function to update it
   - useState(false) = starts as false (menu closed)
   ============================================================ */

"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { isLoggedIn } from "@/lib/auth";

/*
  Auth state lives in localStorage, an "external store" React doesn't know
  about. useSyncExternalStore reads it safely — false on the server (where
  there's no localStorage) and the real value on the client, without a
  useState+useEffect round trip.
*/
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

export default function Navbar() {
  /*
    STATE: isMobileMenuOpen
    - false = mobile menu is hidden (default)
    - true = mobile menu is visible
    
    When the user clicks the hamburger icon (☰), we call
    setIsMobileMenuOpen(true) to show the menu.
    When they click a link or the X, we set it back to false.
  */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const loggedIn = useSyncExternalStore(subscribeToAuthChanges, isLoggedIn, getServerAuthSnapshot);

  return (
    /* 
      <header> — semantic HTML tag meaning "site header"
      className={styles.navbar} — this applies CSS from Navbar.module.css
      
      📚 WHY .module.css instead of regular .css?
      CSS Modules scope styles to THIS component only.
      If you write .navbar in Navbar.module.css, it won't affect
      any other .navbar class in other files. This prevents
      CSS conflicts as the project grows.
    */
    <header className={styles.navbar}>
      <div className={`container ${styles.navbarInner}`}>
        {/* 
          LOGO SECTION
          Link = Next.js component for navigation (better than <a> tag
          because it doesn't reload the whole page — just the content)
          
          href="/" = clicking the logo goes to the home page
        */}
        <Link href="/" className={styles.logo}>
          {/* 
            The logo is an SVG (Scalable Vector Graphics) — a code-based
            image that stays crisp at any size. We draw a blood drop shape.
          */}
          <div className={styles.logoIcon}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              {/* A blood drop shape using SVG path */}
              <path
                d="M16 2C16 2 6 14 6 20C6 25.5228 10.4772 30 16 30C21.5228 30 26 25.5228 26 20C26 14 16 2 16 2Z"
                fill="#DC3545"
              />
              {/* A small heart inside the drop */}
              <path
                d="M16 22C16 22 12 19.5 12 17.5C12 16.5 13 15.5 14 16.5L16 18.5L18 16.5C19 15.5 20 16.5 20 17.5C20 19.5 16 22 16 22Z"
                fill="white"
              />
            </svg>
          </div>
          <span className={styles.logoText}>
            Blood<span className={styles.logoHighlight}>Connect</span>
          </span>
        </Link>

        {/* 
          DESKTOP NAVIGATION LINKS
          These are hidden on mobile (handled by CSS media queries).
          
          Each Link goes to a different page:
          - /search = find donors page
          - /register = sign up as donor
          - /login = log into your account
        */}
        <nav className={styles.desktopNav}>
          <Link href="/search" className={styles.navLink}>
            Find Donors
          </Link>
          <Link href="/about" className={styles.navLink}>
            How It Works
          </Link>
          {loggedIn ? (
            <Link href="/profile/me" className={styles.navLink}>
              My Dashboard
            </Link>
          ) : (
            <Link href="/login" className={styles.navLink}>
              Log In
            </Link>
          )}
          {!loggedIn && (
            <>
              <Link href="/register/recipient" className={styles.navLink}>
                Register to Find Donors
              </Link>
              <Link href="/register" className={`btn btn-primary ${styles.registerBtn}`}>
                Register as Donor
              </Link>
            </>
          )}
        </nav>

        {/* 
          MOBILE HAMBURGER BUTTON
          Only visible on mobile screens (hidden on desktop via CSS).
          
          onClick: When tapped, toggles the mobile menu open/closed.
          The ! (NOT operator) flips true→false and false→true.
          
          aria-label: Screen readers read this text for blind users.
          Without it, a screen reader would just say "button" with
          no explanation of what it does. Accessibility matters!
        */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {/* 
            Show ✕ (close icon) when menu is open,
            show ☰ (hamburger icon) when menu is closed.
            
            These are the three-line hamburger lines built with <span> elements.
          */}
          <div className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* 
          MOBILE MENU OVERLAY
          This slides in from the right when isMobileMenuOpen is true.
          
          The conditional class: if isMobileMenuOpen is true, we add
          styles.mobileMenuOpen which makes the menu visible via CSS.
        */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <nav className={styles.mobileNav}>
              <Link
                href="/search"
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Find Donors
              </Link>
              <Link
                href="/about"
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              {loggedIn ? (
                <Link
                  href="/profile/me"
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
              )}
              {!loggedIn && (
                <Link
                  href="/register/recipient"
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register to Find Donors
                </Link>
              )}
              {!loggedIn && (
                <Link
                  href="/register"
                  className={`btn btn-primary btn-lg ${styles.mobileRegisterBtn}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register as Donor
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
