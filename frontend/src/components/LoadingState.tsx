export function LoadingState({ label = 'Loading CogniCare safely...' }: { label?: string }) {
  return (
    <div className="loading-state" role="status">
      <span className="spinner" />
      <p>{label}</p>
    </div>
  );
}

