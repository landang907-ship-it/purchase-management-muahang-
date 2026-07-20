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
  tag_name: string | null;
  is_urgent?: boolean;
  urgent_reason?: string | null;
  urgent_image_url?: string | null;
  urgent_status?: string | null;
  disappeared_at: string;
}

export async function fetchProcessedOrders(): Promise<ProcessedOrder[]> {
  // 1. Fetch from processed_orders
  const { data: processedData, error: processedError } = await supabase
    .from('processed_orders')
    .select('*')
    .order('disappeared_at', { ascending: false });

  if (processedError) {
    console.error('Error fetching processed orders:', processedError);
  }

  // 2. Fetch from purchase_orders where urgent_status = 'processing'
  const { data: purchaseData, error: purchaseError } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('urgent_status', 'processing');

  if (purchaseError) {
    console.error('Error fetching processing purchase orders:', purchaseError);
  }

  const result: ProcessedOrder[] = [];

  if (processedData) {
    result.push(...(processedData as ProcessedOrder[]));
  }

  if (purchaseData) {
    const processingItems: ProcessedOrder[] = purchaseData.map((po) => ({
      id: po.id,
      user_id: po.user_id,
      pr_number: po.pr_number,
      item_no: po.item_no,
      description: po.description,
      requester: po.requester,
      quantity: po.quantity?.toString() || null,
      unit: po.unit,
      status: po.status,
      tag_name: po.tag_name,
      is_urgent: po.is_urgent,
      urgent_reason: po.urgent_reason,
      urgent_image_url: po.urgent_image_url,
      urgent_status: po.urgent_status,
      disappeared_at: po.created_at || new Date().toISOString()
    }));
    result.push(...processingItems);
  }

  // Sort by disappeared_at descending
  return result.sort((a, b) => new Date(b.disappeared_at).getTime() - new Date(a.disappeared_at).getTime());
}
