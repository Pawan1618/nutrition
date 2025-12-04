'use client';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    type?: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, type = 'success' }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
                >
                    <div className="glass-card px-6 py-4 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center shadow-lg
                            ${type === 'success'
                                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30'
                                : 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/30'}
                        `}>
                            {type === 'success' ? <Check className="text-white" size={20} /> : <X className="text-white" size={20} />}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                {type === 'success' ? 'Success!' : 'Error'}
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                                {message}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
