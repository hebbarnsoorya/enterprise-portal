"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Heart, 
  Flame, 
  Receipt, 
  ArrowUpRight 
} from 'lucide-react';

const DASHBOARD_CARDS = [
  {
    title: "User Management1",
    description: "Manage system access, roles, and administrative permissions.",
    icon: <Users className="text-blue-600" size={24} />,
    href: "/users",
    color: "bg-blue-50",
    shadow: "shadow-blue-500/10"
  },
  {
    title: "Devotee Management",
    description: "View and manage devotee records, history, and profiles.",
    icon: <Heart className="text-rose-600" size={24} />,
    href: "/devotees",
    color: "bg-rose-50",
    shadow: "shadow-rose-500/10"
  },
  {
    title: "Aradhana Services",
    description: "Schedule and monitor daily Aradhana activities and bookings.",
    icon: <Flame className="text-amber-600" size={24} />,
    href: "/aradhana",
    color: "bg-amber-50",
    shadow: "shadow-amber-500/10"
  },
  {
    title: "Receipts & Billing",
    description: "Track financial transactions, generate receipts, and audit logs.",
    icon: <Receipt className="text-emerald-600" size={24} />,
    href: "/receipts",
    color: "bg-emerald-50",
    shadow: "shadow-emerald-500/10"
  }
];

export default function DashboardHub() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500 mt-1 font-medium">Select a module below to begin managing your records.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DASHBOARD_CARDS.map((card) => (
          <Link 
            key={card.href} 
            href={card.href}
            className={`group relative p-6 bg-white border border-slate-100 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl ${card.shadow}`}
          >
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
              {card.icon}
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-2">{card.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              {card.description}
            </p>

            <div className="flex items-center text-blue-600 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Open Module <ArrowUpRight size={14} className="ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}