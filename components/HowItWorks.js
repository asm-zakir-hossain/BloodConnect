/* ============================================================
   HOW IT WORKS SECTION — components/HowItWorks.js
   ============================================================
   
   📚 PURPOSE
   This section explains the platform in 3 simple steps.
   Visitors should understand "what do I do here?" within seconds.
   
   📚 WHY 3 STEPS?
   The "Rule of Three" is a design/communication principle:
   - 1 step feels incomplete
   - 5+ steps feel overwhelming
   - 3 steps feel balanced and easy to remember
   
   📚 PATTERN: DATA-DRIVEN RENDERING
   Instead of writing the same card HTML three times, we define
   the data in an array and use .map() to loop through it.
   This is a fundamental React pattern called "rendering lists."
   
   Benefits:
   - Less code duplication
   - Easy to add/remove/edit steps (just change the array)
   - Consistent structure guaranteed
   ============================================================ */

import styles from "./HowItWorks.module.css";

/*
  DATA ARRAY — each object represents one "step" card.
  
  id: unique identifier (React requires this when rendering lists)
  step: the step number displayed
  icon: SVG path data for the step's icon
  title: the step's heading
  description: explanation of what happens in this step
*/
const steps = [
  {
    id: 1,
    step: "01",
    title: "Search by Blood Group & Area",
    description:
      "Select the blood group you need and your location. We'll instantly show you eligible donors nearby who are ready to help.",
    icon: (
      /* Search/magnifying glass icon */
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
  },
  {
    id: 2,
    step: "02",
    title: "Contact the Donor",
    description:
      "View the donor's profile and availability status. Call them directly — their phone number is just one tap away for logged-in users.",
    icon: (
      /* Phone icon */
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
  },
  {
    id: 3,
    step: "03",
    title: "Save a Life",
    description:
      "After donating, the donor logs it in their profile. The system automatically tracks their 90-day cooldown and marks them available again.",
    icon: (
      /* Heart icon */
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className="container">
        {/* Section header — label + title + subtitle */}
        <div className="section-header">
          <span className="section-label">How It Works</span>
          <h2 className="section-title">Three Simple Steps</h2>
          <p className="section-subtitle">
            Whether you need blood urgently or want to register as a donor, 
            the process is quick and straightforward.
          </p>
        </div>

        {/* 
          STEPS GRID
          📚 .map() — RENDERING LISTS IN REACT
          
          .map() loops through our "steps" array and creates a card
          for EACH item. It's like a for-loop but returns JSX.
          
          key={step.id} — React needs a unique "key" for each item
          in a list so it can efficiently update the DOM when data changes.
          Without keys, React would re-render ALL items even if only one changed.
        */}
        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <div key={step.id} className={styles.stepCard}>
              {/* Step number badge */}
              <div className={styles.stepNumber}>{step.step}</div>
              
              {/* Icon circle */}
              <div className={styles.stepIcon}>
                {step.icon}
              </div>
              
              {/* Step title and description */}
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
