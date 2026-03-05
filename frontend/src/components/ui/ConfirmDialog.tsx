import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm Delete', message = 'Are you sure? This action cannot be undone.', loading }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <p className="text-gray-600">{message}</p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="btn-danger flex-1">
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
