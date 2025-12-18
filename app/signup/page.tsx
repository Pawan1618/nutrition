'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/client';

export default function Signup() {
    const router = useRouter();
    const [name, setName] = useState('');
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

    const handleSignup = async () => {
        if (!email || !password || !name) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError(null);

        const supabase = createClient();

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (error) throw error;

            // Successful signup
            router.push('/dashboard');
            router.refresh(); // Refresh to update server components
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Signup failed';
            console.error('Signup error:', error);
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
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 mb-6 shadow-lg shadow-blue-500/20 border-4 border-white dark:border-slate-800">
                        <User className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Create Account</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Join NutriQuest to start your journey.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-5">
                    {/* Name Input */}
                    <div>
                        <label className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider ml-1 mb-1 block">Full Name</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 py-4 pl-12 pr-4 rounded-xl text-slate-900 dark:text-white focus:border-blue-500/50 focus:bg-white dark:focus:bg-black/50 outline-none transition-all placeholder:text-slate-400"
                                placeholder="John Doe"
                            />
                            <User className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider ml-1 mb-1 block">Email Address</label>
                        <div className="relative group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 py-4 pl-12 pr-4 rounded-xl text-slate-900 dark:text-white focus:border-blue-500/50 focus:bg-white dark:focus:bg-black/50 outline-none transition-all placeholder:text-slate-400"
                                placeholder="name@example.com"
                            />
                            <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider ml-1 mb-1 block">Password</label>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 py-4 pl-12 pr-12 rounded-xl text-slate-900 dark:text-white focus:border-blue-500/50 focus:bg-white dark:focus:bg-black/50 outline-none transition-all placeholder:text-slate-400"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-4 text-slate-400 hover:text-blue-500 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleSignup}
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 text-center">
                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Already have an account? </span>
                        <Link href="/login" className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
