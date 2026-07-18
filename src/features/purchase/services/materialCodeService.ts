import { supabase } from '@/lib/supabase';

export interface MaterialCode {
    id?: string;
    code: string;
    description: string;
    created_at?: string;
}

/**
 * Fetches all material codes from the database.
 * Uses a count query followed by parallel requests to bypass the default 1000 rows limit of Supabase.
 */
export async function fetchMaterialCodes(): Promise<MaterialCode[]> {
    const { count, error: countError } = await supabase
        .from('material_codes')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        throw new Error(countError.message);
    }

    if (!count) return [];

    const step = 1000;
    const promises = [];
    
    for (let from = 0; from < count; from += step) {
        promises.push(
            supabase
                .from('material_codes')
                .select('*')
                .order('created_at', { ascending: false })
                .range(from, from + step - 1)
        );
    }

    const results = await Promise.all(promises);
    let allData: MaterialCode[] = [];
    
    for (const res of results) {
        if (res.error) {
            throw new Error(res.error.message);
        }
        if (res.data) {
            allData = allData.concat(res.data);
        }
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

/**
 * Deletes all material codes from the database.
 */
export async function deleteAllMaterialCodes(): Promise<void> {
    const { error } = await supabase
        .from('material_codes')
        .delete()
        .neq('code', ''); // Delete all rows where code is not empty string (effectively all rows)

    if (error) {
        throw new Error(error.message);
    }
}
