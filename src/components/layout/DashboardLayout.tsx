import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, List, BarChart2, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">TimeTrack Pro</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-56px)] lg:h-screen">
        {/* Sidebar */}
        <nav className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
          <div className="flex items-center gap-2 px-2 mb-8">
            <Timer className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-semibold">TimeTrack Pro</span>
          </div>

          <div className="flex-1 space-y-1">
            <NavItem icon={Timer} label="Timer" path="/dashboard" />
            <NavItem icon={List} label="Tasks" path="/dashboard/tasks" />
            <NavItem icon={BarChart2} label="Reports" path="/dashboard/reports" />
            <NavItem icon={User} label="Profile" path="/dashboard/profile" />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="px-2 mb-2">
              <p className="text-sm font-medium text-gray-900">{user?.username}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
          <div className="flex justify-around">
            <MobileNavItem icon={Timer} path="/dashboard" />
            <MobileNavItem icon={List} path="/dashboard/tasks" />
            <MobileNavItem icon={BarChart2} path="/dashboard/reports" />
            <MobileNavItem icon={User} path="/dashboard/profile" />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  path: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, path }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className="flex items-center gap-2 w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
};

interface MobileNavItemProps {
  icon: React.FC<{ className?: string }>;
  path: string;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ icon: Icon, path }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className="p-4 text-gray-500 hover:text-indigo-600"
    >
      <Icon className="w-6 h-6" />
    </button>
  );
};