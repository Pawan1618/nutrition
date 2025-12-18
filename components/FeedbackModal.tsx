'use client';
import React, { useState } from 'react';
import { X, Send, Loader2, MessageSquare, Bug, Lightbulb } from 'lucide-react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'bug' | 'enhancement'>('bug');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    body: description,
                    label: type
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit feedback');
            }

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setTitle('');
                setDescription('');
                onClose();
            }, 2000);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-white/10 text-center">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Send className="text-emerald-500" size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Feedback Sent!</h3>
                    <p className="text-slate-500 dark:text-slate-400">Thank you for helping us improve.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-white/10 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <MessageSquare className="text-emerald-500" />
                        Give Feedback
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setType('bug')}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${type === 'bug'
                                ? 'bg-red-500/10 border-red-500 text-red-500'
                                : 'bg-slate-50 dark:bg-white/5 border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10'
                                }`}
                        >
                            <Bug size={24} />
                            <span className="font-bold text-sm">Report Bug</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('enhancement')}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${type === 'enhancement'
                                ? 'bg-blue-500/10 border-blue-500 text-blue-500'
                                : 'bg-slate-50 dark:bg-white/5 border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10'
                                }`}
                        >
                            <Lightbulb size={24} />
                            <span className="font-bold text-sm">Feature Request</span>
                        </button>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Brief summary of the issue"
                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                            placeholder="Describe what happened or what you'd like to see..."
                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 dark:text-white resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Submit Feedback <Send size={20} /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}
