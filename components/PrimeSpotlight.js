import Link from "next/link";
import styles from "./PrimeSpotlight.module.css";

export default function PrimeSpotlight() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.card}>
          <span className={styles.tag}>Community Spotlight</span>
          <h2 className={styles.title}>Prime University Blood Donor Community</h2>
          <p className={styles.text}>
            Students and alumni of Prime University are among our most active
            donors. Visit the dedicated community page to find Prime University
            donors and learn how to join.
          </p>
          <Link href="/prime-university" className="btn btn-primary btn-lg">
            Explore the Community
          </Link>
        </div>
      </div>
    </section>
  );
}
