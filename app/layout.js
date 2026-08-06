/* ============================================================
   ROOT LAYOUT — app/layout.js
   ============================================================
   
   📚 WHAT IS THIS FILE?
   In Next.js (App Router), layout.js is a SPECIAL file.
   It wraps EVERY page in your app. Think of it as the "frame"
   around a picture — the frame stays the same, but the picture
   (page content) changes.
   
   This is where we put things that appear on EVERY page:
   - The <html> and <body> tags
   - Meta tags for SEO (title, description)
   - The global CSS import
   - Shared components like Navbar and Footer
   
   📚 WHY "export const metadata"?
   Next.js uses this object to automatically generate <title>,
   <meta description>, and other SEO tags in the <head> of every
   page. This is MUCH easier than manually writing <head> tags.
   
   📚 WHY { children }?
   "children" is a special React prop. Whatever page you navigate to
   (home, search, login) gets passed in as "children" and rendered
   between the Navbar and Footer. It's like a placeholder slot.
   ============================================================ */

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/*
  metadata — This object tells Next.js what to put in the <head> tag.
  
  title: Shows in the browser tab and Google search results
  description: Shows as the snippet text under titles in Google
  keywords: Helps search engines understand what this page is about
  
  These are critical for SEO (Search Engine Optimization) — making
  sure people can find our blood donation platform via Google.
*/
export const metadata = {
  title: {
    default: "BloodConnect — Find Blood Donors Near You",
    template: "%s | BloodConnect",
    /* template: When a sub-page sets its own title like "Search",
       it becomes "Search | BloodConnect" */
  },
  description:
    "Find eligible blood donors near you instantly. BloodConnect connects blood recipients with verified, available donors based on blood group and location across Bangladesh.",
  keywords: [
    "blood donation",
    "blood donor",
    "find blood donor",
    "blood bank",
    "Bangladesh blood donor",
    "emergency blood",
  ],
};

/*
  RootLayout — The main wrapper component.
  
  Line by line:
  - <html lang="en">: Tells browsers/screen-readers the content is in English
  - <body>: The visible page content
  - <Navbar />: Our navigation bar (we'll create this next)
  - <main>{children}</main>: The actual page content goes here
    <main> is a semantic HTML5 tag meaning "main content of the page"
  - <Footer />: Our footer (we'll create this too)
*/
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
