import { supabase } from '@/lib/supabase';
import type { UserAccount } from './authService';

export interface UserProfile extends UserAccount {
    role: 'admin' | 'user';
    display_name: string | null;
    department: string | null;
    updated_at: string;
}

/**
 * Fetch the user's profile (account details)
 */
export async function getProfile(userName: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user', userName)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
    return data as UserProfile;
}

/**
 * Update the user's profile
 */
export async function updateProfile(userName: string, updates: Partial<UserProfile>): Promise<boolean> {
    const { error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('user', userName);

    if (error) {
        console.error('Error updating profile:', error);
        return false;
    }
    return true;
}

/**
 * [Admin only] Fetch all profiles
 */
export async function getAllProfiles(): Promise<UserProfile[]> {
    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all profiles:', error);
        return [];
    }
    return data as UserProfile[];
}

/**
 * [Admin only] Update user role
 */
export async function updateUserRole(userName: string, role: 'admin' | 'user'): Promise<boolean> {
    const { error } = await supabase
        .from('accounts')
        .update({ role })
        .eq('user', userName);

    if (error) {
        console.error('Error updating user role:', error);
        return false;
    }
    return true;
}
