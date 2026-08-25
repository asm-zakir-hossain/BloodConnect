/* ============================================================
   CTA SECTION — components/CTASection.js
   ============================================================
   
   📚 PURPOSE
   CTA = "Call to Action" — this section appears near the bottom
   of the page and gives visitors ONE more chance to take action
   before they reach the footer.
   
   📚 WHY A SEPARATE CTA SECTION?
   Many visitors scroll all the way down before deciding.
   Having a strong CTA at the bottom captures those "fence-sitters"
   who read everything and are now convinced but need a button.
   
   📚 DESIGN PRINCIPLE: VISUAL DISTINCTION
   We give this section a subtle colored background (light pink)
   to make it stand out from the regular white sections above it.
   ============================================================ */

import Link from "next/link";
import styles from "./CTASection.module.css";

export default function CTASection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.ctaCard}>
          {/* Decorative elements for visual interest */}
          <div className={styles.decorLeft}>
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" opacity="0.1">
              <path d="M60 10C60 10 20 50 20 70C20 92.0914 37.9086 110 60 110C82.0914 110 100 92.0914 100 70C100 50 60 10 60 10Z" fill="currentColor"/>
            </svg>
          </div>
          <div className={styles.decorRight}>
            <svg width="80" height="80" viewBox="0 0 120 120" fill="none" opacity="0.08">
              <path d="M60 10C60 10 20 50 20 70C20 92.0914 37.9086 110 60 110C82.0914 110 100 92.0914 100 70C100 50 60 10 60 10Z" fill="currentColor"/>
            </svg>
          </div>

          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to Make a Difference?
            </h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of donors across Bangladesh. Register once, 
              get discovered when someone needs your blood type.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/register" className={`btn btn-primary btn-lg ${styles.ctaBtn}`}>
                Register as Donor — It&apos;s Free
              </Link>
              <Link href="/search" className={`btn btn-ghost btn-lg ${styles.ctaBtnSecondary}`}>
                Or find a donor now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
