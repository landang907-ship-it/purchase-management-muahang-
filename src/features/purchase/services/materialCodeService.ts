import { supabase } from '@/lib/supabase';

export interface MaterialCode {
    id?: string;
    code: string;
    description: string;
    created_at?: string;
}

/**
 * Fetches all material codes from the database.
 * Uses pagination to bypass the default 1000 rows limit of Supabase.
 */
export async function fetchMaterialCodes(): Promise<MaterialCode[]> {
    let allData: MaterialCode[] = [];
    let from = 0;
    const step = 1000;

    while (true) {
        const { data, error } = await supabase
            .from('material_codes')
            .select('*')
            .order('created_at', { ascending: false })
            .range(from, from + step - 1);

        if (error) {
            throw new Error(error.message);
        }
        
        if (!data || data.length === 0) break;
        allData = [...allData, ...data];
        
        if (data.length < step) break;
        from += step;
    }

    return allData;
}

/**
 * Upserts a batch of material codes.
 * Uses 'code' as the conflict resolution key.
 * Chunks the data to prevent payload size errors on large files.
 */
export async function upsertMaterialCodes(codes: MaterialCode[]): Promise<void> {
    if (codes.length === 0) return;

    const chunkSize = 1000;
    for (let i = 0; i < codes.length; i += chunkSize) {
        const chunk = codes.slice(i, i + chunkSize);
        // Supabase upsert requires specifying the conflict target if we want to update on conflict
        const { error } = await supabase
            .from('material_codes')
            .upsert(chunk, { onConflict: 'code' });

        if (error) {
            throw new Error(error.message);
        }
    }
}
