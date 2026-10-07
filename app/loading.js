export default function Loading() {
  return (
    <div
      className="container"
      style={{ padding: "4rem 0", textAlign: "center" }}
      aria-busy="true"
      aria-label="Loading page content"
    >
      <div
        style={{
          height: "2rem",
          width: "60%",
          margin: "0 auto 1rem",
          background: "#f3f4f6",
          borderRadius: "8px",
        }}
      />
      <div
        style={{
          height: "1rem",
          width: "80%",
          margin: "0 auto 2rem",
          background: "#f3f4f6",
          borderRadius: "8px",
        }}
      />
      <div
        style={{
          height: "12rem",
          background: "#f3f4f6",
          borderRadius: "12px",
        }}
      />
    </div>
  );
}
