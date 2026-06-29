/**
 * Supabase client for database operations.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://abfrrzuxvbnvizlwpxea.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZnJyenV4dmJudml6bHdweGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MTQ4MDEsImV4cCI6MjA5ODI5MDgwMX0.A9AzG5eHUseszQ_MoN0NuQSo2TX2FXmIHpeih87bdn0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface PurchaseRecord {
    id: string;
    user_id: string;
    file_name: string;
    imported_at: string;
    total_rows: number;
    data: PurchaseRow[];
}

export interface PurchaseRow {
    'Yc.m.hàng': string;
    'Vật tư': string;
    'Văn bản ngắn': string;
    'Ng.yêu cầu': string;
    'Số lượng': string;
    'Ngày YC': string;
    'T.trg xử lý': string;
}

/**
 * Save imported Excel data to Supabase
 */
export async function savePurchaseData(
    userId: string,
    fileName: string,
    rows: PurchaseRow[]
): Promise<{ success: boolean; recordId?: string; error?: string }> {
    try {
        const { data, error } = await supabase
            .from('purchase_records')
            .insert({
                user_id: userId,
                file_name: fileName,
                total_rows: rows.length,
                data: rows,
            })
            .select('id')
            .single();

        if (error) {
            console.error('[Supabase] Insert error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, recordId: data.id };
    } catch (err) {
        console.error('[Supabase] Save error:', err);
        return { success: false, error: 'Lỗi kết nối database' };
    }
}

/**
 * Load purchase history for a user
 */
export async function getPurchaseHistory(
    userId: string
): Promise<PurchaseRecord[]> {
    try {
        const { data, error } = await supabase
            .from('purchase_records')
            .select('*')
            .eq('user_id', userId)
            .order('imported_at', { ascending: false });

        if (error) {
            console.error('[Supabase] Query error:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('[Supabase] Load error:', err);
        return [];
    }
}

/**
 * Load specific record by ID
 */
export async function getPurchaseRecord(
    recordId: string
): Promise<PurchaseRecord | null> {
    try {
        const { data, error } = await supabase
            .from('purchase_records')
            .select('*')
            .eq('id', recordId)
            .single();

        if (error) {
            console.error('[Supabase] Query error:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('[Supabase] Load error:', err);
        return null;
    }
}

/**
 * Delete a purchase record
 */
export async function deletePurchaseRecord(
    recordId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase
            .from('purchase_records')
            .delete()
            .eq('id', recordId);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        return { success: false, error: 'Lỗi xóa dữ liệu' };
    }
}
