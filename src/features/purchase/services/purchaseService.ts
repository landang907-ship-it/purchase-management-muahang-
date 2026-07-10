import { supabase } from './supabaseClient';
import type { PurchaseRow } from './excel';

/**
 * Maximum number of recent records to keep globally.
 * Older records are auto-deleted on every new import.
 */
const MAX_GLOBAL_RECORDS = 5;

/**
 * Save imported Excel data to Supabase.
 * Auto-deletes older records so we only keep the N most recent files globally.
 */
export async function savePurchaseData(userId: string, rows: PurchaseRow[], fileName: string) {
  // 1. Insert new record
  const { error: insertErr } = await supabase
    .from('purchase_records')
    .insert({
      user_id: userId,
      data: rows as any,
      file_name: fileName,
      total_rows: rows.length,
    });

  if (insertErr) throw insertErr;

  // 2. Fetch all records, sorted newest first
  const { data: all, error: fetchErr } = await supabase
    .from('purchase_records')
    .select('id, imported_at')
    .order('imported_at', { ascending: false });

  if (fetchErr) throw fetchErr;

  // 3. Find IDs to delete (keep only the MAX_GLOBAL_RECORDS newest)
  const toDelete = (all ?? [])
    .slice(MAX_GLOBAL_RECORDS)
    .map((r) => r.id);

  if (toDelete.length === 0) return;

  // 4. Delete older records
  const { error: delErr } = await supabase
    .from('purchase_records')
    .delete()
    .in('id', toDelete);

  if (delErr) {
    // Don't throw — insert succeeded; cleanup is best-effort
    // eslint-disable-next-line no-console
    console.warn('[savePurchaseData] cleanup delete failed:', delErr);
  }
}

/**
 * Load the most recent saved record for a user.
 */
export async function loadPurchaseData(_userId?: string): Promise<PurchaseRow[]> {
  const { data, error } = await supabase
    .from('purchase_records')
    .select('data')
    .order('imported_at', { ascending: false })
    .limit(1);

  if (error) throw error;
  return (data?.[0]?.data as PurchaseRow[]) || [];
}

/**
 * List all recent records metadata for a user (for picker UI).
 */
export async function listPurchaseRecords(
  limit = MAX_GLOBAL_RECORDS,
): Promise<Array<{ id: string; file_name: string; imported_at: string; total_rows: number }>> {
  const { data, error } = await supabase
    .from('purchase_records')
    .select('id, file_name, imported_at, total_rows')
    .order('imported_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Array<{ id: string; file_name: string; imported_at: string; total_rows: number }>;
}