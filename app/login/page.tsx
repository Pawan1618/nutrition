'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowRight } from 'lucide-react';

export default function Login() {
    const router = useRouter();
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId.trim()) return;

        setLoading(true);
        setError(null);

        try {
            // Verify user exists
            const res = await fetch(`/api/stats?userId=${userId}`);
            if (res.ok) {
                localStorage.setItem('userId', userId);
                router.push('/dashboard');
            } else {
                setError('User not found. Please check the ID or create a new account.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/user');
            if (res.ok) {
                const user = await res.json();
                if (user && user.id) {
                    localStorage.setItem('userId', user.id);
                    router.push('/dashboard');
                } else {
                    setError('No users found. Please create an account.');
                }
            } else {
                setError('Failed to fetch users.');
            }
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

            <div className="w-full max-w-md glass rounded-2xl p-8 shadow-xl">
                <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
                <p className="text-gray-400 text-center mb-8">Enter your User ID to continue</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Input
                            placeholder="User ID (e.g. cmio...)"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading || !userId.trim()}
                        className="w-full bg-green-500 hover:bg-green-400 text-black font-bold"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <div className="mt-6 flex items-center justify-between">
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="px-4 text-sm text-gray-500">or</span>
                    <div className="h-px bg-white/10 flex-1" />
                </div>

                <div className="mt-6 space-y-4">
                    <Button
                        variant="ghost"
                        onClick={handleGuestLogin}
                        disabled={loading}
                        className="w-full"
                    >
                        Login as Guest / Demo User
                    </Button>

                    <p className="text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/onboarding" className="text-green-400 hover:text-green-300 font-medium">
                            Start your journey
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
