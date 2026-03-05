import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 size={size} className="animate-spin text-brand-teal" />
    </div>
  );
}
