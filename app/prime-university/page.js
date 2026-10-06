/* ============================================================
   PRIME UNIVERSITY DONOR COMMUNITY — app/prime-university/page.js
   ============================================================ */

import Link from "next/link";
import styles from "./prime.module.css";
import PrimeUniversityCommunity from "@/components/PrimeUniversityCommunity";

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
        <PrimeUniversityCommunity styles={styles} />
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
