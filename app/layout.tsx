import './globals.css';
import { Providers } from '@/components/Providers';
import QueryProvider from '@/components/QueryProvider';

export const metadata = {
  title: 'Nutrition Tracker',
  description: 'Track your nutrition and fitness goals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen selection:bg-emerald-500/30">
        {/* Ambient Background Glows */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 dark:bg-green-900/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-900/20 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-500/10 dark:bg-purple-900/10 rounded-full blur-[100px]" />
        </div>

        <Providers>
          <QueryProvider>
            {children}
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}


