import { supabase } from '@/features/purchase/services/supabaseClient';

export interface UserProfile {
    user: string;
    avatar_url?: string;
    role?: string;
}

export async function getProfile(username: string): Promise<UserProfile | null> {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user', username)
            .single();

        if (error) return null;
        return data;
    } catch {
        return null;
    }
}
