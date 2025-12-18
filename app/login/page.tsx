'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/client';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                router.push('/dashboard');
            }
        };
        checkUser();
    }, [router]);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError(null);

        const supabase = createClient();

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Successful login
            router.push('/dashboard');
            router.refresh(); // Refresh to update server components
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-emerald-500/30">

            {/* Top Right Actions */}
            <div className="absolute top-6 right-6 z-20">
                <ThemeToggle />
            </div>

            {/* Glass Card */}
            <div className="w-full max-w-md glass-card p-8 rounded-[2.5rem] shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 mb-6 shadow-lg shadow-emerald-500/20 border-4 border-white dark:border-slate-800">
                        <Lock className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Enter your credentials to access your tracker.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-5">
                    {/* Email Input */}
                    <div>
                        <label className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider ml-1 mb-1 block">Email Address</label>
                        <div className="relative group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 py-4 pl-12 pr-4 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500/50 focus:bg-white dark:focus:bg-black/50 outline-none transition-all placeholder:text-slate-400"
                                placeholder="name@example.com"
                            />
                            <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider ml-1 mb-1 block">Password</label>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 py-4 pl-12 pr-12 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500/50 focus:bg-white dark:focus:bg-black/50 outline-none transition-all placeholder:text-slate-400"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-4 text-slate-400 hover:text-emerald-500 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <button className="text-sm text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors font-medium">
                            Forgot your password?
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 text-center">
                        <p className="text-center text-slate-500 dark:text-slate-400 mt-6">
                            Don&apos;t have an account?{' '}
                            <a href="/signup" className="text-emerald-500 hover:text-emerald-400 font-bold hover:underline transition-all">
                                Sign Up
                            </a>
                        </p></div>
                </div>
            </div>
        </div>
    );
}
