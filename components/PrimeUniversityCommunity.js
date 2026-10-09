"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { searchDonors, updateMyProfile, getMyProfile } from "@/lib/api";
import { isLoggedIn, getStoredDonor, setSession } from "@/lib/auth";

export default function PrimeUniversityCommunity({ styles }) {
  const [donors, setDonors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bloodGroupFilter, setBloodGroupFilter] = useState("ALL");
  const [showAll, setShowAll] = useState(false);

  const BLOOD_GROUPS = ["ALL", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const [joined, setJoined] = useState(false);
  const [joinError, setJoinError] = useState("");
  const loggedIn = isLoggedIn();

  useEffect(() => {
    if (loggedIn) {
      const donor = getStoredDonor();
      if (donor && donor.university === "Prime University") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setJoined(true);
      } else {
        getMyProfile()
          .then((profile) => {
            if (profile && profile.university === "Prime University") setJoined(true);
          })
          .catch(() => {});
      }
    }
  }, [loggedIn]);

  useEffect(() => {
    searchDonors({ university: "Prime University", showUnavailable: true, pageSize: 2000 })
      .then((res) => {
        setDonors(res.items || []);
        setTotal(res.total || 0);
      })
      .catch(() => setDonors([]))
      .finally(() => setLoading(false));
  }, []);

  const availableCount = useMemo(
    () => donors.filter((d) => d.isAvailable).length,
    [donors]
  );

  const visible = useMemo(
    () =>
      bloodGroupFilter === "ALL"
        ? donors
        : donors.filter((d) => d.bloodGroup === bloodGroupFilter),
    [donors, bloodGroupFilter]
  );

  const DISPLAY_LIMIT = 50;
  const displayed = showAll ? visible : visible.slice(0, DISPLAY_LIMIT);

  return (
    <div className={styles.grid}>
      <section className={styles.card}>
        <h2>Find Prime University Students by Blood Group</h2>
        <select
          value={bloodGroupFilter}
          onChange={(e) => { setBloodGroupFilter(e.target.value); setShowAll(false); }}
          style={{ width: "100%", padding: "8px 12px", marginBottom: "12px", borderRadius: "8px", border: "1px solid #e5e7eb" }}
        >
          {BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg}>
              {bg === "ALL" ? "All Blood Groups" : bg}
            </option>
          ))}
        </select>
        {loading ? (
          <p>Loading...</p>
        ) : visible.length === 0 ? (
          <>
            <p>No Prime University students found.</p>
            <p style={{ marginTop: "8px" }}>
              <Link href="/register" className="btn btn-primary btn-sm">
                Be the first to register
              </Link>
            </p>
          </>
        ) : (
          <>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {displayed.map((d) => (
                <li key={d.id} style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <Link href={`/profile/${d.id}`} style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 700 }}>
                    {d.name}
                  </Link>{" "}
                  — {d.bloodGroup}, {d.area ? `${d.area}, ` : ""}{d.district}
                  {d.isAvailable ? "" : " (unavailable)"}
                </li>
              ))}
            </ul>
            {!showAll && visible.length > DISPLAY_LIMIT && (
              <button
                className="btn btn-sm"
                style={{ marginTop: "12px" }}
                onClick={() => setShowAll(true)}
              >
                Show all {visible.length} students
              </button>
            )}
          </>
        )}
      </section>

      <section className={styles.card}>
        <h2>Community Statistics</h2>
        <p><strong>{total || donors.length}</strong> registered Prime University users</p>
        <p><strong>{availableCount}</strong> currently available to donate</p>
        <div style={{ marginTop: "16px" }}>
          {loggedIn ? (
            joined ? (
              <p><strong>You&apos;re listed as a Prime University student.</strong></p>
            ) : (
              <>
                <p>Are you a Prime University student?</p>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    try {
                      await updateMyProfile({ university: "Prime University" });
                      const updated = await getMyProfile();
                      const donor = getStoredDonor();
                      if (donor) setSession(localStorage.getItem("bloodconnect_token"), updated);
                      setJoined(true);
                      const res = await searchDonors({ university: "Prime University", showUnavailable: true, pageSize: 2000 });
                      setDonors(res.items || []);
                    } catch (err) {
                      setJoinError(err.message || "Failed to update profile");
                    }
                  }}
                >
                  Yes, I&apos;m a Prime University student
                </button>
                {joinError && <p role="alert">{joinError}</p>}
              </>
            )
          ) : (
            <p>
              Prime University student?{" "}
              <Link href="/register" className="btn btn-primary">
                Register and add your university
              </Link>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
