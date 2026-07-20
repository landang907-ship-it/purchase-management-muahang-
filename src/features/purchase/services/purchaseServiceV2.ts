import { supabase } from './supabaseClient';
import type { PurchaseRow } from './excel';

export interface ImportBatch {
    id: string;
    user_id: string;
    file_name: string;
    imported_at: string;
    total_rows: number;
}

export interface PurchaseOrder {
    id: string;
    batch_id: string;
    user_id: string;
    pr_number: string;
    item_no: string;
    description: string;
    requester: string;
    quantity: number;
    unit: string;
    status: string;
    tag_name: string;
    unique_order_key: string;
    created_at: string;
}

/**
 * Save imported Excel data to Supabase (V2 - Normalized)
 */
export async function savePurchaseDataV2(userId: string, rows: PurchaseRow[], fileName: string) {
    if (rows.length === 0) return;

    // 1. Create a new import batch
    const { data: batch, error: batchErr } = await supabase
        .from('import_batches')
        .insert({
            user_id: userId,
            file_name: fileName,
            total_rows: rows.length,
        })
        .select()
        .single();

    if (batchErr) throw batchErr;

    // 2. Prepare orders for bulk insert
    const ordersToInsert = rows.map((r: any) => ({
        batch_id: batch.id,
        user_id: userId,
        pr_number: r['Yc.m.hàng'] || '',
        item_no: r['Vật tư'] || '',
        description: r['Văn bản ngắn'] || '',
        requester: r['Ng.yêu cầu'] || '',
        quantity: r['Số lượng'] ? Number(r['Số lượng']) : 0,
        unit: r['Đơn vị đo lường'] || '',
        status: r['T.trg xử lý'] || '',
        tag_name: r['TAG-NAME'] || '',
        unique_order_key: `${r['Yc.m.hàng'] || ''}_${r['Vật tư'] || ''}`,
    }));

    // 3. Insert in chunks of 500 to avoid payload size limits
    const chunkSize = 500;
    for (let i = 0; i < ordersToInsert.length; i += chunkSize) {
        const chunk = ordersToInsert.slice(i, i + chunkSize);
        const { error: insertErr } = await supabase
            .from('purchase_orders')
            .insert(chunk);

        if (insertErr) {
            console.error('[savePurchaseDataV2] Error inserting chunk:', insertErr);
            throw insertErr;
        }
    }
}

/**
 * Load orders for a specific batch, or the latest batch if not provided
 */
export async function loadPurchaseOrdersV2(userId: string, batchId?: string): Promise<PurchaseOrder[]> {
    let targetBatchId = batchId;

    // If no batch ID is provided, find the most recent one
    if (!targetBatchId) {
        const { data: latestBatch, error: batchErr } = await supabase
            .from('import_batches')
            .select('id')
            .eq('user_id', userId)
            .order('imported_at', { ascending: false })
            .limit(1)
            .single();

        if (batchErr || !latestBatch) {
            console.warn('No batches found for user or error fetching:', batchErr);
            return [];
        }
        targetBatchId = latestBatch.id;
    }

    // Fetch orders for this batch
    const { data: orders, error: ordersErr } = await supabase
        .from('purchase_orders')
        .select('*')
        .eq('batch_id', targetBatchId)
        .order('created_at', { ascending: true });

    if (ordersErr) throw ordersErr;
    return orders as PurchaseOrder[];
}

/**
 * List all import batches for a user
 */
export async function listImportBatches(userId: string): Promise<ImportBatch[]> {
    const { data, error } = await supabase
        .from('import_batches')
        .select('*')
        .eq('user_id', userId)
        .order('imported_at', { ascending: false });

    if (error) throw error;
    return data as ImportBatch[];
}
