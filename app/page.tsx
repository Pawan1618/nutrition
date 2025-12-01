import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="z-10 text-center space-y-8 max-w-2xl">
        <h1 className="text-6xl font-bold tracking-tighter">
          Level Up Your <span className="neon-text-green">Health</span>
        </h1>
        <p className="text-xl text-gray-400">
          The most engaging way to track nutrition. Earn XP, maintain streaks, and visualize your diet like never before.
        </p>

        <div className="flex gap-4 justify-center pt-8">
          <Link
            href="/onboarding"
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-transform hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Your Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            href="/login"
            className="px-8 py-4 glass rounded-full font-bold hover:bg-white/10 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Feature Grid Preview */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="glass rounded-2xl p-6 shadow-xl transition-all duration-300 hover:bg-white/10 p-8 text-center">
          <div className="text-4xl mb-4">🔥</div>
          <h3 className="text-xl font-bold mb-2">Daily Streaks</h3>
          <p className="text-gray-400">Keep the fire alive by logging daily.</p>
        </div>
        <div className="glass rounded-2xl p-6 shadow-xl transition-all duration-300 hover:bg-white/10 p-8 text-center neon-border-blue">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">Diet Heatmap</h3>
          <p className="text-gray-400">Visualize your consistency over time.</p>
        </div>
        <div className="glass rounded-2xl p-6 shadow-xl transition-all duration-300 hover:bg-white/10 p-8 text-center">
          <div className="text-4xl mb-4">⚔️</div>
          <h3 className="text-xl font-bold mb-2">XP System</h3>
          <p className="text-gray-400">Earn XP for every healthy choice.</p>
        </div>
      </div>
    </main>
  );
}
