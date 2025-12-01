'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronLeft, Camera } from 'lucide-react';
import { LevelUpModal } from '@/components/Gamification/LevelUpModal';

export default function LogFood() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [newLevel, setNewLevel] = useState(1);
    const [formData, setFormData] = useState({
        foodName: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        quantity: '1',
        isUnhealthy: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        try {
            const res = await fetch('/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, userId }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.leveledUp) {
                    setNewLevel(data.newLevel);
                    setShowLevelUp(true);
                } else {
                    router.push('/dashboard');
                }
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleLevelUpClose = () => {
        setShowLevelUp(false);
        router.push('/dashboard');
    };

    return (
        <main className="min-h-screen p-6">
            <LevelUpModal isOpen={showLevelUp} level={newLevel} onClose={handleLevelUpClose} />

            <div className="flex items-center mb-8">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2">
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold ml-2">Log Food</h1>
            </div>

            <div className="glass rounded-2xl p-6 shadow-xl transition-all duration-300 hover:bg-white/10 space-y-6">
                <div className="flex justify-center mb-6">
                    <button className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-xl hover:border-green-500 transition-colors group">
                        <Camera className="w-8 h-8 text-gray-400 group-hover:text-green-500 mb-2" />
                        <span className="text-sm text-gray-400 group-hover:text-green-500">Snap a photo (Coming Soon)</span>
                    </button>
                </div>

                <Input
                    name="foodName"
                    label="Food Name"
                    value={formData.foodName}
                    onChange={handleChange}
                    placeholder="e.g., Grilled Chicken Salad"
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        name="calories"
                        type="number"
                        label="Calories"
                        value={formData.calories}
                        onChange={handleChange}
                        placeholder="0"
                    />
                    <Input
                        name="quantity"
                        type="number"
                        label="Servings"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="1"
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Input
                        name="protein"
                        type="number"
                        label="Protein (g)"
                        value={formData.protein}
                        onChange={handleChange}
                        placeholder="0"
                    />
                    <Input
                        name="carbs"
                        type="number"
                        label="Carbs (g)"
                        value={formData.carbs}
                        onChange={handleChange}
                        placeholder="0"
                    />
                    <Input
                        name="fats"
                        type="number"
                        label="Fats (g)"
                        value={formData.fats}
                        onChange={handleChange}
                        placeholder="0"
                    />
                </div>

                <div className="flex items-center gap-3 p-4 glass rounded-xl cursor-pointer" onClick={() => setFormData({ ...formData, isUnhealthy: !formData.isUnhealthy })}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.isUnhealthy ? 'border-red-500 bg-red-500' : 'border-gray-500'}`}>
                        {formData.isUnhealthy && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className={formData.isUnhealthy ? 'text-red-400 font-bold' : 'text-gray-400'}>Mark as Unhealthy / Cheat Meal</span>
                </div>

                <Button onClick={handleSubmit} disabled={loading} className="w-full bg-green-500 text-black mt-4">
                    {loading ? 'Logging...' : 'Add to Log'}
                </Button>
            </div>
        </main>
    );
}
