'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, Plus, Activity, User } from 'lucide-react';

export const BottomNav = () => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const NavItem = ({ href, icon: Icon, label, active }: { href: string, icon: any, label: string, active: boolean }) => (
        <Link href={href} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-2xl transition-all duration-300 ${active ? 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span className={`text-[10px] font-bold mt-1 uppercase transition-all duration-300 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 hidden'}`}>{label}</span>
        </Link>
    );

    return (
        <div className="fixed bottom-6 left-0 w-full px-6 z-40 pointer-events-none flex justify-center">
            <nav className="pointer-events-auto w-full max-w-lg bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-2 shadow-2xl flex justify-between items-center relative">
                <div className="absolute inset-0 rounded-3xl bg-white/5 pointer-events-none" />

                <NavItem href="/dashboard" icon={Home} label="Dash" active={isActive('/dashboard')} />
                <NavItem href="/log" icon={List} label="Log" active={isActive('/log')} />

                <div className="relative -top-6 mx-2">
                    <Link href="/log" className="w-14 h-14 bg-emerald-500 hover:bg-emerald-400 rounded-2xl flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 hover:-translate-y-1 transition-all group">
                        <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                    </Link>
                </div>

                <NavItem href="/progress" icon={Activity} label="Stats" active={isActive('/progress')} />
                <NavItem href="/profile" icon={User} label="Agent" active={isActive('/profile')} />
            </nav>
        </div>
    );
};
