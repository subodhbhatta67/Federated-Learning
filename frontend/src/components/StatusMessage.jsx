// StatusMessage.jsx — one place for loading, error and empty states.
// type: "loading" | "error" | "empty"
export default function StatusMessage({ type, message }) {
  if (type === "loading") {
    return (
      <p className="status status-loading" role="status">
        {message || "Loading..."}
      </p>
    );
  }
  if (type === "error") {
    return (
      <p className="status status-error" role="alert">
        <strong>Something went wrong:</strong> {message}
      </p>
    );
  }
  return (
    <p className="status status-empty" role="status">
      {message || "No data for this selection yet"}
    </p>
  );
}
