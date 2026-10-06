"use client";

export default function Error({ error, reset }) {
  return (
    <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button className="btn btn-primary" onClick={reset}>Try again</button>
    </div>
  );
}
