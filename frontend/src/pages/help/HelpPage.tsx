import { BookOpen, Github, Mail, ExternalLink } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Help & Documentation</h1>

      <div className="space-y-6">
        <div className="card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center flex-shrink-0"><BookOpen size={20} className="text-brand-teal" /></div>
            <div>
              <h2 className="text-lg font-semibold text-brand-dark mb-2">Getting Started</h2>
              <p className="text-gray-600 text-sm leading-relaxed">Farm Management System helps you manage your entire farming operation. Track employees, crops, livestock, machinery, and production records all in one place.</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-brand-dark mb-4">Modules Overview</h2>
          <div className="space-y-3">
            {[
              { title: 'Employees', desc: 'Manage farm workers — track names, roles, contact info, and salary.' },
              { title: 'Crops', desc: 'Track planted crops and manage associated expenses, sales, and field operations.' },
              { title: 'Livestock', desc: 'Keep records of animals on your farm and their production data.' },
              { title: 'Machinery', desc: 'Log equipment with purchase info, track activities and maintenance.' },
              { title: 'Milk Production', desc: 'Daily milk tracking — produced, consumed, sold — with analytics charts.' },
              { title: 'Egg Production', desc: 'Daily egg collection records with sales tracking and charts.' },
            ].map(m => (
              <div key={m.title} className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-brand-teal/5 transition-colors">
                <div className="w-2 h-2 rounded-full bg-brand-teal mt-1.5 flex-shrink-0" />
                <div><p className="font-medium text-brand-dark text-sm">{m.title}</p><p className="text-gray-500 text-xs mt-0.5">{m.desc}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-brand-dark mb-4">Quick Tips</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-brand-teal font-bold">•</span> Use the search bar on list pages to quickly find records.</li>
            <li className="flex gap-2"><span className="text-brand-teal font-bold">•</span> Click on a crop, animal, or machine to see its detailed records.</li>
            <li className="flex gap-2"><span className="text-brand-teal font-bold">•</span> Production pages include charts — toggle them with the chart button.</li>
            <li className="flex gap-2"><span className="text-brand-teal font-bold">•</span> Use filters on production pages to narrow by year and month.</li>
            <li className="flex gap-2"><span className="text-brand-teal font-bold">•</span> All data is saved to the server automatically when you submit a form.</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-brand-dark mb-4">Support</h2>
          <div className="flex flex-wrap gap-3">
            <a href="https://github.com" target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-dark text-white text-sm hover:bg-brand-dark/90 transition-colors"><Github size={16} /> GitHub <ExternalLink size={12} /></a>
            <a href="mailto:support@farm.com" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-teal text-white text-sm hover:bg-brand-teal-dark transition-colors"><Mail size={16} /> Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
