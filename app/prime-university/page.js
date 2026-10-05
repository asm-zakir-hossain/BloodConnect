/* ============================================================
   PRIME UNIVERSITY DONOR COMMUNITY — app/prime-university/page.js
   ============================================================ */

import Link from "next/link";
import styles from "./prime.module.css";

export const metadata = {
  title: "Prime University Blood Donor Community",
  description:
    "A dedicated page for the Prime University blood donor community — find Prime University donors and join the movement.",
};

export default function PrimeUniversityPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <HeroHeader />
        <div className={styles.grid}>
          <section className={styles.card}>
            <h2>About the Community</h2>
            <p>
              The Prime University blood donor community is a group of students,
              faculty, and alumni committed to safe and timely blood donation.
              Members are listed on BloodConnect and respond to local requests
              across Dhaka.
            </p>
          </section>
          <section className={styles.card}>
            <h2>Get Involved</h2>
            <p>
              Register as a donor with your Prime University affiliation in your
              profile, keep your availability up to date, and respond quickly
              when someone nearby needs your blood group.
            </p>
            <Link href="/register" className="btn btn-primary">
              Join as a Donor
            </Link>
          </section>
          <section className={styles.card}>
            <h2>Find Prime University Donors</h2>
            <p>
              Browse donors in the Dhaka division and filter by blood group to
              find Prime University donors near you.
            </p>
            <Link href="/search?division=Dhaka" className="btn btn-secondary">
              Search Donors in Dhaka
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

function HeroHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Prime University Blood Donor Community</h1>
      <p className={styles.subtitle}>
        Connecting Prime University&apos;s student and alumni donors with people
        in need across Bangladesh.
      </p>
    </header>
  );
}
