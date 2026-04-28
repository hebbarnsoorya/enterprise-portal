import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, ChevronLeft, LogOut, BookAIcon } from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';


export const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) => {
  const pathname = usePathname();
    const router = useRouter();


  // Navigation Schema
  const menuItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'User Management4', href: '/users', icon: Users },
     { name: 'Document Management', href: '/docs', icon: BookAIcon },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];
const handleLogout = () => {
  // 1. Remove the token
  Cookies.remove('auth-token');

  // 2. Redirect to Login
  router.push('/login');
  
  // 3. Optional: Clear any local state or refresh
  router.refresh();
};
  return (
    <aside className={`
      bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800
      ${isOpen ? 'w-64' : 'w-20'} flex flex-col
    `}>
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        {isOpen && <span className="font-bold text-white tracking-tight">PORTAL.EXE</span>}
        <button onClick={() => setIsOpen(!isOpen)} className="hover:text-white transition-colors">
          <ChevronLeft className={`transition-transform ${!isOpen && 'rotate-180'}`} size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 space-y-1 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`
              flex items-center gap-4 px-3 py-2.5 rounded-lg transition-all group
              ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}
            `}>
              <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              {isOpen && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-800">
        <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
            <LogOut size={20} />
            {isOpen && <span className="text-sm font-medium">Sign Out</span>}
            </button>
      </div>
    </aside>
  );
};