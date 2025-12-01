'use client';

import { motion } from 'framer-motion';

interface CalorieRingProps {
    current: number;
    target: number;
}

export function CalorieRing({ current, target }: CalorieRingProps) {
    const percentage = Math.min(100, Math.max(0, (current / target) * 100));
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-64 h-64">
            {/* Background Circle */}
            <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                    cx="128"
                    cy="128"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="12"
                    fill="transparent"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx="128"
                    cy="128"
                    r={radius}
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    strokeLinecap="round"
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#39ff14" />
                        <stop offset="100%" stopColor="#00f3ff" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Content */}
            <div className="text-center z-10">
                <div className="text-5xl font-bold tracking-tighter text-white">
                    {current}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-widest mt-1">
                    / {target} kcal
                </div>
            </div>
        </div>
    );
}
