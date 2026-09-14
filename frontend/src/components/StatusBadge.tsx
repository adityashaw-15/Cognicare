import { Cloud, CloudOff, RotateCw } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

export function StatusBadge() {
  const { online, syncMessage, pendingCount } = useAppData();
  return (
    <div className={`status-badge ${online ? 'status-online' : 'status-offline'}`} aria-live="polite">
      {online ? <Cloud size={18} /> : <CloudOff size={18} />}
      <span>{online ? 'ONLINE' : 'OFFLINE - LOCAL MODE'}</span>
      {pendingCount > 0 && (
        <span className="pending-pill">
          <RotateCw size={14} /> {pendingCount} pending
        </span>
      )}
      <small>{syncMessage}</small>
    </div>
  );
}

