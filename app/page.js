/* ============================================================
   HOME PAGE — app/page.js
   ============================================================
   
   📚 WHAT IS THIS FILE?
   In Next.js App Router, the file at app/page.js is the HOME PAGE.
   It maps to the URL "/" (the root/homepage of the website).
   
   📚 HOW DOES NEXT.JS ROUTING WORK?
   Next.js uses "file-based routing" — the folder structure
   determines the URL structure:
   
   File                    →  URL
   app/page.js            →  /           (homepage)
   app/search/page.js     →  /search
   app/login/page.js      →  /login
   app/register/page.js   →  /register
   app/profile/[id]/page.js → /profile/123 (dynamic route)
   
   No manual route configuration needed! Just create folders and files.
   
   📚 COMPONENT COMPOSITION
   This page is built by COMPOSING (combining) smaller components.
   Each component handles its own section:
   
   <Hero />            → Big intro section with headline + CTAs
   <BloodGroupSearch />→ Quick search grid by blood type
   <HowItWorks />      → 3-step explanation
   <Stats />           → Impact numbers on red gradient
   <CTASection />      → Final "Register" push
   
   The Navbar and Footer are NOT imported here because they're
   already in layout.js (which wraps ALL pages).
   
   📚 WHY SEPARATE COMPONENTS?
   1. Each component is small and easy to understand
   2. You can reuse components on other pages
   3. Multiple developers can work on different sections
   4. Easy to rearrange sections — just change the order here
   ============================================================ */

import Hero from "@/components/Hero";
import BloodGroupSearch from "@/components/BloodGroupSearch";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import CTASection from "@/components/CTASection";

/*
  📚 IMPORT PATHS — WHAT DOES "@/" MEAN?
  
  The "@/" is an "import alias" configured in jsconfig.json.
  It points to the root of the project. So:
  
  @/components/Hero = ./components/Hero.js
  
  Without it, you'd have to write relative paths like:
  ../components/Hero or ../../components/Hero
  
  The alias keeps imports clean and prevents path confusion
  in deeply nested files.
*/

export default function Home() {
  /*
    This function returns JSX — the HTML-like syntax that React uses.
    Each component renders its own section of the page.
    
    The order here determines the order on the page (top to bottom):
    1. Hero (first thing visitors see)
    2. BloodGroupSearch (quick search cards)
    3. HowItWorks (3-step explanation)
    4. Stats (impact numbers)
    5. CTASection (final call to action)
  */
  return (
    <>
      <Hero />
      <BloodGroupSearch />
      <HowItWorks />
      <Stats />
      <CTASection />
    </>
  );
}

/*
  📚 WHAT IS <> AND </>?
  
  These are called "React Fragments."
  In React, a component can only return ONE root element.
  
  ❌ This would ERROR:
  return (
    <Hero />
    <Stats />
  )
  
  ✅ We could wrap in a <div>, but that adds an unnecessary extra element:
  return (
    <div>
      <Hero />
      <Stats />
    </div>
  )
  
  ✅ Better: Use a Fragment (<>...</>) — it groups elements without
  adding an extra DOM node. It's invisible in the final HTML.
*/
