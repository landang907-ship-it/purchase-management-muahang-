import { supabase } from './supabaseClient';
import type { Workshop } from '../hooks/useWorkshopConfig';

export async function saveWorkshopConfig(userId: string, workshops: Workshop[]): Promise<void> {
    const { error } = await supabase
        .from('workshop_configs')
        .upsert({
            user_id: userId,
            config_data: workshops as any,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

    if (error) {
        throw error;
    }
}

export async function loadWorkshopConfig(userId: string): Promise<Workshop[] | null> {
    const { data, error } = await supabase
        .from('workshop_configs')
        .select('config_data')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) {
        throw error;
    }
    
    if (data && data.config_data) {
        return data.config_data as Workshop[];
    }
    
    return null;
}
