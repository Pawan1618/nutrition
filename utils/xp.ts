import { createClient } from '@/utils/supabase/client';

export const XP_CONSTANTS = {
    LOG_FOOD: 10,
    COMPLETE_GOAL: 50,
    MAINTAIN_STREAK: 20,
    HABIT_COMPLETION: 5,
};

export const calculateLevel = (xp: number) => {
    // Simple formula: Level = floor(sqrt(XP / 100)) + 1
    // Level 1: 0-99 XP
    // Level 2: 100-399 XP
    // Level 3: 400-899 XP
    return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const calculateNextLevelXP = (level: number) => {
    // Inverse of the level formula
    return Math.pow(level, 2) * 100;
};

export const addXP = async (userId: string, amount: number) => {
    const supabase = createClient();

    // 1. Fetch current XP
    const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', userId)
        .single();

    if (fetchError) {
        // If row not found (PGRST116), create it
        if (fetchError.code === 'PGRST116') {
            const { error: insertError } = await supabase
                .from('profiles')
                .insert({ id: userId, xp: 0, level: 1, streak: 0 });

            if (insertError) {
                console.error('Error creating profile:', insertError);
                return { error: insertError };
            }
            // Continue with 0 XP
        } else {
            console.error('Error fetching XP:', fetchError);
            return { error: fetchError };
        }
    }

    const currentXP = profile?.xp || 0;
    const newXP = currentXP + amount;
    const newLevel = calculateLevel(newXP);

    // 2. Update XP and Level
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            xp: newXP,
            level: newLevel
        })
        .eq('id', userId);

    if (updateError) {
        console.error('Error updating XP:', updateError);
        return { error: updateError };
    }

    return { xp: newXP, level: newLevel };
};
