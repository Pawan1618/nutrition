'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function Onboarding() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        sex: 'male',
        weight: '',
        height: '',
        goalType: 'maintain',
        dailyCalorieGoal: '2000',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const user = await res.json();
                localStorage.setItem('userId', user.id);
                router.push('/dashboard');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to create profile. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setError('Something went wrong. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    const validateStep = () => {
        switch (step) {
            case 1:
                return formData.name.trim().length > 0;
            case 2:
                return formData.age && parseInt(formData.age) > 0 && formData.sex;
            case 3:
                return formData.weight && parseFloat(formData.weight) > 0 && formData.height && parseFloat(formData.height) > 0;
            case 4:
                return formData.goalType && formData.dailyCalorieGoal && parseInt(formData.dailyCalorieGoal) > 0;
            default:
                return false;
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />

            <div className="w-full max-w-md">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Step {step} of 4</h1>
                    <div className="h-2 w-24 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait" custom={step}>
                    <motion.div
                        key={step}
                        custom={step}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="glass rounded-2xl p-6 shadow-xl transition-all duration-300 hover:bg-white/10 min-h-[400px] flex flex-col justify-center"
                    >
                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold">What's your name?</h2>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    autoFocus
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold">Tell us about you</h2>
                                <Input
                                    name="age"
                                    type="number"
                                    label="Age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="25"
                                />
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-400 ml-1">Sex</label>
                                    <select
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleChange}
                                        className="w-full h-12 rounded-xl glass px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-transparent"
                                    >
                                        <option value="male" className="bg-black">Male</option>
                                        <option value="female" className="bg-black">Female</option>
                                        <option value="other" className="bg-black">Other</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold">Body Stats</h2>
                                <Input
                                    name="weight"
                                    type="number"
                                    label="Weight (kg)"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="70"
                                />
                                <Input
                                    name="height"
                                    type="number"
                                    label="Height (cm)"
                                    value={formData.height}
                                    onChange={handleChange}
                                    placeholder="175"
                                />
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold">Your Goal</h2>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-400 ml-1">Goal Type</label>
                                    <select
                                        name="goalType"
                                        value={formData.goalType}
                                        onChange={handleChange}
                                        className="w-full h-12 rounded-xl glass px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-transparent"
                                    >
                                        <option value="loss" className="bg-black">Weight Loss</option>
                                        <option value="maintain" className="bg-black">Maintain</option>
                                        <option value="gain" className="bg-black">Weight Gain</option>
                                    </select>
                                </div>
                                <Input
                                    name="dailyCalorieGoal"
                                    type="number"
                                    label="Daily Calorie Target"
                                    value={formData.dailyCalorieGoal}
                                    onChange={handleChange}
                                    placeholder="2000"
                                />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="flex flex-col gap-4 mt-8">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-between">
                        <Button
                            variant="ghost"
                            onClick={prevStep}
                            disabled={step === 1}
                            className={step === 1 ? 'invisible' : ''}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" /> Back
                        </Button>

                        {step < 4 ? (
                            <Button onClick={nextStep} disabled={!validateStep()}>
                                Next <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={loading || !validateStep()}
                                className="bg-green-500 hover:bg-green-400 text-black shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Profile...' : 'Start Tracking'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
