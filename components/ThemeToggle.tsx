'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';

export function ThemeToggle() {
    const { toggleTheme } = useTheme();

    const handleClick = () => {
        toggleTheme();
    };

    return (
        <button
            onClick={handleClick}
            type="button"
            className="relative p-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-white/10 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/30 transition-all backdrop-blur-md shadow-sm"
            aria-label="Toggle theme"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-2.5 left-2.5 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
    );
}
