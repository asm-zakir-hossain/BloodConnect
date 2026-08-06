/* ============================================================
   SEARCH PAGE — app/search/page.js
   ============================================================
   
   📚 PURPOSE
   The main donor discovery page. Reads query parameters (e.g. ?blood_group=O+),
   filters mock donors based on blood group, division, district, and availability,
   and renders the results.
   
   📚 NEXT.JS CONCEPT: useSearchParams & Suspense
   `useSearchParams()` allows us to read URL query parameters like `?blood_group=O+`.
   Next.js requires components using `useSearchParams` to be wrapped in a `<Suspense>`
   boundary to ensure smooth rendering during navigation.
   ============================================================ */

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchFilters from "@/components/SearchFilters";
import DonorCard from "@/components/DonorCard";
import { mockDonors } from "@/data/mockDonors";
import styles from "./search.module.css";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialBloodGroup = searchParams.get("blood_group") || "ALL";

  /* ---- FILTER STATE ---- */
  const [filters, setFilters] = useState({
    bloodGroup: initialBloodGroup,
    division: "",
    district: "",
    showUnavailable: false,
  });

  /* Sync filters if URL query parameter changes */
  useEffect(() => {
    const bg = searchParams.get("blood_group");
    if (bg) {
      setFilters((prev) => ({ ...prev, bloodGroup: bg }));
    }
  }, [searchParams]);

  /* Handle filter updates */
  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };
      // If division changes, clear district
      if (key === "division") {
        updated.district = "";
      }
      return updated;
    });
  };

  /* Reset filters */
  const handleReset = () => {
    setFilters({
      bloodGroup: "ALL",
      division: "",
      district: "",
      showUnavailable: false,
    });
  };

  /* ---- FILTERING LOGIC ---- */
  const filteredDonors = mockDonors.filter((donor) => {
    // 1. Blood group filter
    if (
      filters.bloodGroup !== "ALL" &&
      donor.bloodGroup !== filters.bloodGroup
    ) {
      return false;
    }

    // 2. Division filter
    if (filters.division && donor.division !== filters.division) {
      return false;
    }

    // 3. District filter
    if (filters.district && donor.district !== filters.district) {
      return false;
    }

    // 4. Availability filter (by default hide unavailable unless toggled)
    if (!filters.showUnavailable && !donor.isAvailable) {
      return false;
    }

    return true;
  });

  return (
    <div className="container">
      <div className={styles.searchLayout}>
        {/* ---- LEFT COLUMN: FILTERS ---- */}
        <aside className={styles.filterSidebar}>
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </aside>

        {/* ---- RIGHT COLUMN: RESULTS LIST ---- */}
        <main className={styles.resultsContent}>
          {/* Results Summary Header */}
          <div className={styles.resultsHeader}>
            <div>
              <h1 className={styles.resultsTitle}>Blood Donors</h1>
              <p className={styles.resultsCount}>
                Showing <strong>{filteredDonors.length}</strong> matching{" "}
                {filteredDonors.length === 1 ? "donor" : "donors"}
                {filters.bloodGroup !== "ALL" && (
                  <span> for <strong>{filters.bloodGroup}</strong></span>
                )}
              </p>
            </div>
          </div>

          {/* Donor Cards Grid or Empty State */}
          {filteredDonors.length > 0 ? (
            <div className={styles.donorGrid}>
              {filteredDonors.map((donor) => (
                <DonorCard key={donor.id} donor={donor} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <h3 className={styles.emptyTitle}>No Donors Found</h3>
              <p className={styles.emptyText}>
                No eligible donors matched your search criteria. Try selecting 
                a different blood group, resetting location filters, or enabling 
                &quot;Include currently unavailable donors&quot;.
              </p>
              <button onClick={handleReset} className="btn btn-secondary">
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className={styles.page}>
      <Suspense fallback={<div className={styles.loading}>Loading search...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
