import { supabase } from './supabaseClient';

export interface ProcessedOrder {
  id: string;
  user_id: string;
  pr_number: string;
  item_no: string | null;
  description: string | null;
  requester: string | null;
  quantity: string | null;
  unit: string | null;
  status: string | null;
  disappeared_at: string;
}

export async function fetchProcessedOrders(): Promise<ProcessedOrder[]> {
  const { data, error } = await supabase
    .from('processed_orders')
    .select('*')
    .order('disappeared_at', { ascending: false });

  if (error) {
    console.error('Error fetching processed orders:', error);
    return [];
  }
  return data as ProcessedOrder[];
}
