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
import { searchDonors } from "@/lib/api";
import styles from "./search.module.css";

function SearchContent() {
  const searchParams = useSearchParams();
  const urlBloodGroup = searchParams.get("blood_group") || "ALL";

  /* ---- FILTER STATE ---- */
  const [filters, setFilters] = useState({
    bloodGroup: urlBloodGroup,
    division: "",
    district: "",
    area: "",
    showUnavailable: false,
  });

  /*
    Re-sync bloodGroup when the URL's ?blood_group= changes (e.g. a link
    elsewhere sends the user back to /search with a new value) — adjusted
    during render rather than in an effect, per
    https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  */
  const [prevUrlBloodGroup, setPrevUrlBloodGroup] = useState(urlBloodGroup);
  if (urlBloodGroup !== prevUrlBloodGroup) {
    setPrevUrlBloodGroup(urlBloodGroup);
    setFilters((prev) => ({ ...prev, bloodGroup: urlBloodGroup }));
  }

  /* ---- FETCH DONORS FROM THE BACKEND ---- */
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const [debouncedArea, setDebouncedArea] = useState(filters.area);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedArea(filters.area), 400);
    return () => clearTimeout(t);
  }, [filters.area]);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    searchDonors({ ...filters, area: debouncedArea, page, pageSize: 12 })
      .then((result) => {
        if (cancelled) return;
        setDonors(result.items);
        setPagination({ total: result.total, totalPages: result.total_pages });
        setError("");
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load donors. Is the backend running?");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters.bloodGroup, filters.division, filters.district, filters.showUnavailable, debouncedArea, page]);

  /* Handle filter updates */
  const handleFilterChange = (key, value) => {
    setPage(1);
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
    setPage(1);
    setFilters({
      bloodGroup: "ALL",
      division: "",
      district: "",
      area: "",
      showUnavailable: false,
    });
  };

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
                {isLoading ? (
                  "Loading donors..."
                ) : (
                  <>
                    Showing <strong>{donors.length}</strong> of{" "}
                    <strong>{pagination.total}</strong> matching{" "}
                    {donors.length === 1 ? "donor" : "donors"}
                    {filters.bloodGroup !== "ALL" && (
                      <span> for <strong>{filters.bloodGroup}</strong></span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Error State */}
          {error && !isLoading && (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>Couldn&apos;t load donors</h3>
              <p className={styles.emptyText}>{error}</p>
            </div>
          )}

          {/* List / Map toggle */}
          <div style={{ marginBottom: "1rem" }}>
            <button
              onClick={() => setView(view === "list" ? "map" : "list")}
              className="btn btn-secondary btn-sm"
            >
              {view === "list" ? "Show Map View" : "Show List View"}
            </button>
          </div>

          {/* Donor Cards Grid or Map or Empty State */}
          {!isLoading && !error && view === "map" && donors.length > 0 && (
            <DonorMap donors={donors} />
          )}
          {!isLoading && !error && view === "list" && (
            donors.length > 0 ? (
              <>
                <div className={styles.donorGrid}>
                  {donors.map((donor) => (
                    <DonorCard key={donor.id} donor={donor} />
                  ))}
                </div>
                {pagination.totalPages > 1 && (
                  <nav className={styles.pagination} aria-label="Search results pages">
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>
                    <span className={styles.pageIndicator}>
                      Page {page} of {pagination.totalPages}
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={page >= pagination.totalPages}
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
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
            )
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
