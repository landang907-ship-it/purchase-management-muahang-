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
  // 0. Load the current/oldest active records to diff against
  const oldRows = await loadPurchaseData(userId);

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

  // 1.5. Detect processed (disappeared) orders
  if (oldRows.length > 0) {
    // Collect keys of new rows. Assuming Yc.m.hàng + Vật tư is the unique key
    const newKeys = new Set(
      rows.map((r: any) => `${r['Yc.m.hàng'] || ''}_${r['Vật tư'] || ''}`)
    );

    const disappearedOrders = oldRows.filter((oldRow: any) => {
      // Check if it was in status '05' (or similar processing status)
      const status = String(oldRow['T.trg xử lý'] || '').trim();
      if (status !== '05') return false;

      const key = `${oldRow['Yc.m.hàng'] || ''}_${oldRow['Vật tư'] || ''}`;
      return !newKeys.has(key);
    });

    if (disappearedOrders.length > 0) {
      const recordsToInsert = disappearedOrders.map((r: any) => ({
        user_id: userId,
        pr_number: r['Yc.m.hàng'] || '',
        item_no: r['Vật tư'] || '',
        description: r['Văn bản ngắn'] || '',
        requester: r['Ng.yêu cầu'] || '',
        quantity: String(r['Số lượng'] || ''),
        unit: r['Đơn vị đo lường'] || '',
        status: r['T.trg xử lý'] || '',
        tag_name: r['TAG-NAME'] || '',
      }));
      
      const { error: processErr } = await supabase
        .from('processed_orders')
        .insert(recordsToInsert);
        
      if (processErr) {
        console.warn('[savePurchaseData] Failed to save processed orders:', processErr);
      }
    }
  }

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