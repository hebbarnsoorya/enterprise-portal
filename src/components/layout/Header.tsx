"use client";
import { UserProfile } from './UserProfile';
import { OrgSwitcher } from './OrgSwitcher';
import { Bell, Globe, Search } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search Bar - "Cool" UI touch */}
      <div className="relative w-96 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search for data, users, or settings..." 
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-lg text-sm transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition">
          <Globe size={20} />
        </button>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-2" />
        
        <OrgSwitcher />
        <UserProfile />
      </div>
    </header>
  );
};