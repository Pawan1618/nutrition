import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// --- CARD ---
export const Card = ({ children, className = "", variant = "default", onClick }: { children: React.ReactNode; className?: string; variant?: "default" | "glass" | "checkable"; onClick?: () => void }) => {
    const baseStyles = "rounded-2xl p-4 transition-all duration-300";
    const variants = {
        default: "bg-slate-900/50 border border-slate-800 shadow-lg",
        glass: "bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl",
        checkable: "bg-slate-900/30 border border-slate-800/50 hover:bg-slate-800/50 cursor-pointer active:scale-[0.98]"
    };

    return (
        <motion.div
            whileHover={onClick ? { scale: 1.01 } : {}}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};

// --- BUTTON ---
export const ActionButton = ({ onClick, icon: Icon, label, variant = "primary", className = "", disabled = false }: { onClick?: () => void; icon?: LucideIcon; label?: string; variant?: "primary" | "secondary" | "ghost" | "liquid" | "fab"; className?: string; disabled?: boolean }) => {
    const baseStyles = "flex items-center justify-center gap-2 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full px-6 py-3 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]",
        secondary: "bg-transparent border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 rounded-full px-6 py-3",
        ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5 rounded-lg p-2",
        liquid: "relative overflow-hidden bg-slate-800 text-emerald-400 rounded-full px-4 py-2 hover:text-white group", // Simplified liquid for now
        fab: "bg-emerald-500 text-slate-950 rounded-full w-14 h-14 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-110 hover:rotate-90 transition-transform fixed bottom-24 right-6 z-50 flex items-center justify-center"
    };

    return (
        <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
            {Icon && <Icon size={variant === 'fab' ? 24 : 20} />}
            {label && <span>{label}</span>}
        </button>
    );
};

// --- INPUT ---
export const FloatingInput = ({ label, value, onChange, type = "text", icon: Icon }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; icon?: LucideIcon }) => {
    return (
        <div className="relative group">
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="peer w-full bg-transparent border-b-2 border-slate-800 py-3 pl-10 pr-2 text-white placeholder-transparent focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder={label}
            />
            {Icon && <Icon className="absolute left-0 top-3 text-slate-500 peer-focus:text-emerald-500 transition-colors" size={20} />}
            <label className="absolute left-10 top-3 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-emerald-500 peer-focus:font-bold pointer-events-none">
                {label}
            </label>
        </div>
    );
};

// --- CIRCULAR PROGRESS ---
export const CircularProgress = ({ current, max, size = 180, strokeWidth = 12, label = "Calories" }: { current: number; max: number; size?: number; strokeWidth?: number; label?: string }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = Math.min(100, Math.max(0, (current / max) * 100));
    const dashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-slate-800/50"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    className="text-emerald-500"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white tracking-tighter">{current}</span>
                <span className="text-slate-400 text-xs uppercase tracking-widest mt-1">/ {max} {label}</span>
            </div>
        </div>
    );
};

// --- STAT CARD ---
export const StatCard = ({ label, value, colorClass = "text-white", icon: Icon, className = "" }: { label: string; value: string; colorClass?: string; icon?: React.ElementType; className?: string }) => {
    return (
        <div className={`bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-2 ${className}`}>
            {Icon && <div className={`p-2 rounded-full bg-slate-800/50 ${colorClass}`}><Icon size={18} /></div>}
            <div className={`font-bold text-lg ${colorClass}`}>{value}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</div>
            {/* Mini Progress Bar */}
            <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div className={`h-full rounded-full ${colorClass.replace('text-', 'bg-')} opacity-80`} style={{ width: '60%' }}></div>
            </div>
        </div>
    );
};

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 ml-1">{children}</h3>
);
