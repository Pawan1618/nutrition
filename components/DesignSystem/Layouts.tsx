import React, { useState } from 'react';
import { Sun, Moon, Home, PlusCircle, User, List } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const AppLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
        {/* Subtle Radial Gradient for Depth */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/20 via-slate-950 to-slate-950 pointer-events-none z-0"></div>

        {/* Mobile-first centered container */}
        <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col pb-24">
            {children}
        </div>
    </div>
);

export const Header = ({ title, subtitle, avatarInitials = "U" }: { title: string; subtitle: string; avatarInitials?: string }) => {
    const [isDark, setIsDark] = useState(true);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="p-6 pt-12 flex justify-between items-center bg-gradient-to-b from-slate-900/0 to-slate-950/0">
            <div>
                <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{subtitle}</h2>
                <h1 className="text-3xl font-black text-white tracking-tight">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors backdrop-blur-md"
                >
                    {isDark ? <Moon size={18} /> : <Sun size={18} />}
                </button>
                <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <span className="text-sm font-bold text-white">{avatarInitials}</span>
                </div>
            </div>
        </header>
    );
};

export const ScrollableContent = ({ children }: { children: React.ReactNode }) => (
    <main className="flex-1 px-5 space-y-6 overflow-y-auto no-scrollbar">
        {children}
    </main>
);

export const GlassNavigation = () => {
    const pathname = usePathname();

    const NavItem = ({ icon: Icon, href, active }: { icon: any, href: string, active?: boolean }) => (
        <Link href={href} className={`p-3 rounded-xl transition-all duration-300 ${active ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`}>
            <Icon size={24} strokeWidth={active ? 2.5 : 2} />
        </Link>
    );

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 pointer-events-none flex justify-center">
            <div className="pointer-events-auto max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-3xl shadow-2xl flex items-center justify-between px-6 py-4">
                <NavItem icon={Home} href="/dashboard" active={pathname === '/dashboard'} />
                <NavItem icon={List} href="/log" active={pathname === '/log'} />

                {/* Central FAB Placeholder - Functionality handled by page-specific FAB usually, but here as a nav item */}
                <div className="relative -top-8">
                    <Link href="/log" className="flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] text-slate-950 hover:scale-105 transition-transform">
                        <PlusCircle size={32} />
                    </Link>
                </div>

                <NavItem icon={User} href="/profile" active={pathname === '/profile'} />
                <div className="w-6"></div> {/* Spacer for balance if needed, or just 4th item */}
            </div>
        </nav>
    );
};
