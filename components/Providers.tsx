'use client';

import { ThemeProvider as NextThemeProvider } from '@/components/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return <NextThemeProvider>{children}</NextThemeProvider>;
}
