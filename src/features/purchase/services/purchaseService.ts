import { supabase } from './supabaseClient';
import type { PurchaseRow } from './excel';

export async function savePurchaseData(userId: string, rows: PurchaseRow[], fileName: string) {
  const { error } = await supabase
    .from('purchase_records')
    .insert({
      user_id: userId,
      data: rows as any,
      file_name: fileName,
      total_rows: rows.length
    });
  
  if (error) throw error;
}

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