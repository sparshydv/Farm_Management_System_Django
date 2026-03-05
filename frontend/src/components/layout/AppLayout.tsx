import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, Wheat, Tractor, PawPrint,
  Milk, Egg, HelpCircle, LogOut, Menu, X, Sprout,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/crops', label: 'Crops', icon: Wheat },
  { to: '/livestock', label: 'Livestock', icon: PawPrint },
  { to: '/machinery', label: 'Machinery', icon: Tractor },
  { to: '/milk-production', label: 'Milk Production', icon: Milk },
  { to: '/egg-production', label: 'Egg Production', icon: Egg },
  { to: '/help', label: 'Help', icon: HelpCircle },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const displayName = user?.display_name || user?.username || 'User';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-brand-dark flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-brand-teal flex items-center justify-center">
            <Sprout size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">FarmFlow</h1>
            <p className="text-gray-400 text-xs">Management System</p>
          </div>
          <button className="ml-auto lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/25'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover border border-white/20"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal font-semibold text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">@{user?.username}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:px-8 shrink-0">
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 text-brand-dark mr-3"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:block">Welcome,</span>
            <span className="text-sm font-semibold text-brand-dark">{displayName}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-brand-light/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
