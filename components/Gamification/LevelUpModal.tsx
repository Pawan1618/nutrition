'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
    isOpen: boolean;
    level: number;
    onClose: () => void;
}

export function LevelUpModal({ isOpen, level, onClose }: LevelUpModalProps) {
    useEffect(() => {
        if (isOpen) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#39ff14', '#00f3ff', '#bc13fe'],
            });
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="glass rounded-2xl p-6 shadow-xl transition-all duration-300 hover:bg-white/10 max-w-sm w-full text-center p-8 border-2 border-green-500 shadow-[0_0_50px_rgba(57,255,20,0.3)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-3xl font-bold mb-2 text-white">LEVEL UP!</h2>
                        <p className="text-gray-300 mb-6">You are now Level <span className="text-green-400 font-bold text-xl">{level}</span></p>

                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition-colors"
                        >
                            Awesome!
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
