import { supabase } from '@/lib/supabase';

export interface MaterialCode {
    id?: string;
    code: string;
    description: string;
    created_at?: string;
}

/**
 * Fetches all material codes from the database.
 */
export async function fetchMaterialCodes(): Promise<MaterialCode[]> {
    const { data, error } = await supabase
        .from('material_codes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }
    return data || [];
}

/**
 * Upserts a batch of material codes.
 * Uses 'code' as the conflict resolution key.
 */
export async function upsertMaterialCodes(codes: MaterialCode[]): Promise<void> {
    if (codes.length === 0) return;

    // Supabase upsert requires specifying the conflict target if we want to update on conflict
    const { error } = await supabase
        .from('material_codes')
        .upsert(codes, { onConflict: 'code' });

    if (error) {
        throw new Error(error.message);
    }
}
