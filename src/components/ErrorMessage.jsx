export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-error">
      <strong>Something went wrong.</strong> {message}
      {onRetry && <button className="btn btn-outline" onClick={onRetry}>Retry</button>}
    </div>
  );
}