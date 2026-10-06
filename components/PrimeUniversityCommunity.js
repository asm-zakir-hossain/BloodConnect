"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { searchDonors } from "@/lib/api";

export default function PrimeUniversityCommunity({ styles }) {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    searchDonors({ university: "Prime University", showUnavailable: true, pageSize: 100 })
      .then((res) => setDonors(res.items || []))
      .catch(() => setDonors([]))
      .finally(() => setLoading(false));
  }, []);

  const availableCount = useMemo(
    () => donors.filter((d) => d.isAvailable).length,
    [donors]
  );

  const visible = useMemo(
    () =>
      donors.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase())
      ),
    [donors, query]
  );

  return (
    <div className={styles.grid}>
      <section className={styles.card}>
        <h2>Find Prime University Students</h2>
        <input
          type="text"
          placeholder="Search students by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "100%", padding: "8px 12px", marginBottom: "12px", borderRadius: "8px", border: "1px solid #e5e7eb" }}
        />
        {loading ? (
          <p>Loading...</p>
        ) : visible.length === 0 ? (
          <p>No Prime University students found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {visible.map((d) => (
              <li key={d.id} style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                <strong>{d.name}</strong> — {d.bloodGroup}, {d.area ? `${d.area}, ` : ""}{d.district}
                {d.isAvailable ? "" : " (unavailable)"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.card}>
        <h2>Community Statistics</h2>
        <p><strong>{donors.length}</strong> registered Prime University users</p>
        <p><strong>{availableCount}</strong> currently available to donate</p>
        <p style={{ marginTop: "16px" }}>
          Prime University student?{" "}
          <Link href="/register" className="btn btn-primary">
            Register and add your university
          </Link>
        </p>
      </section>
    </div>
  );
}
