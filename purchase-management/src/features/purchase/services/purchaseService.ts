import { supabase } from './supabaseClient';
import type { PurchaseRow } from './excel';

/**
 * Maximum number of recent records to keep per user.
 * Older records are auto-deleted on every new import.
 */
const MAX_RECORDS_PER_USER = 2;

/**
 * Save imported Excel data to Supabase.
 * Auto-deletes older records so each user only keeps the N most recent files.
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

  // 2. Fetch all records for this user, sorted newest first
  const { data: all, error: fetchErr } = await supabase
    .from('purchase_records')
    .select('id, imported_at')
    .eq('user_id', userId)
    .order('imported_at', { ascending: false });

  if (fetchErr) throw fetchErr;

  // 3. Find IDs to delete (keep only the MAX_RECORDS_PER_USER newest)
  const toDelete = (all ?? [])
    .slice(MAX_RECORDS_PER_USER)
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
export async function loadPurchaseData(userId: string): Promise<PurchaseRow[]> {
  const { data, error } = await supabase
    .from('purchase_records')
    .select('data')
    .eq('user_id', userId)
    .order('imported_at', { ascending: false })
    .limit(1);

  if (error) throw error;
  return (data?.[0]?.data as PurchaseRow[]) || [];
}

/**
 * List all recent records metadata for a user (for picker UI).
 */
export async function listPurchaseRecords(
  userId: string,
  limit = MAX_RECORDS_PER_USER,
): Promise<Array<{ id: string; file_name: string; imported_at: string; total_rows: number }>> {
  const { data, error } = await supabase
    .from('purchase_records')
    .select('id, file_name, imported_at, total_rows')
    .eq('user_id', userId)
    .order('imported_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Array<{ id: string; file_name: string; imported_at: string; total_rows: number }>;
}