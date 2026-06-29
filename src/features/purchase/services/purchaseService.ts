import { supabase } from './supabaseClient';
import type { PurchaseRow } from './excel';

export async function savePurchaseData(userId: string, rows: PurchaseRow[], fileName: string) {
  const { error } = await supabase
    .from('purchase_data')
    .upsert({
      user_id: userId,
      data: rows as any,
      file_name: fileName,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });
  
  if (error) throw error;
}

export async function loadPurchaseData(userId: string): Promise<PurchaseRow[]> {
  const { data, error } = await supabase
    .from('purchase_data')
    .select('data')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return (data?.data as PurchaseRow[]) || [];
}