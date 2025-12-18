'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as Theme | null;
            if (savedTheme) {
                if (savedTheme === 'dark') document.documentElement.classList.add('dark');
                return savedTheme;
            }
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
                return 'dark';
            }
        }
        return 'light';
    });

    useEffect(() => {
        // Just empty effect or sync logic if needed, but init is handled
    }, []);

    const toggleTheme = useCallback(() => {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';

        console.log('Current theme from DOM:', isDark ? 'dark' : 'light');
        console.log('Switching to:', newTheme);

        if (isDark) {
            html.classList.remove('dark');
        } else {
            html.classList.add('dark');
        }

        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);

        console.log('HTML class now:', html.className);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    // Type assertion to ensure Theme is not null for consumers
    // In practice, it will be 'light' or 'dark' due to initialization
    return context as ThemeContextType;
}
