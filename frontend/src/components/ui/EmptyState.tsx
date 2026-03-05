import { Inbox } from 'lucide-react';

interface Props {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title = 'No data yet', message = 'Get started by adding your first record.', action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-teal/10 flex items-center justify-center mb-4">
        <Inbox size={28} className="text-brand-teal" />
      </div>
      <h3 className="text-lg font-semibold text-brand-dark mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-xs">{message}</p>
      {action}
    </div>
  );
}
