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
    is_urgent?: boolean;
    urgent_status?: 'pending' | 'processing' | 'completed';
    urgent_reason?: string | null;
    urgent_image_url?: string | null;
    request_date?: string;
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

    // 2. Prepare orders for bulk insert, handling duplicates within the file
    const ordersMap = new Map<string, any>();
    
    for (const r of rows) {
        const prNumber = r['Yc.m.hàng'] || '';
        const itemNo = r['Vật tư'] || '';
        const uniqueKey = `${prNumber}_${itemNo}`;
        
        ordersMap.set(uniqueKey, {
            batch_id: batch.id,
            user_id: userId,
            pr_number: prNumber,
            item_no: itemNo,
            description: r['Văn bản ngắn'] || '',
            requester: r['Ng.yêu cầu'] || '',
            quantity: r['Số lượng'] ? Number(r['Số lượng']) : 0,
            unit: r['Đơn vị'] || '',
            status: r['T.trg xử lý'] || '',
            tag_name: r['TAG-NAME'] || '',
            unique_order_key: uniqueKey,
            request_date: r['Ngày YC'] || '',
        });
    }

    const ordersToInsert = Array.from(ordersMap.values());

    // 3. Insert in chunks of 500 to avoid payload size limits
    const chunkSize = 500;
    try {
        for (let i = 0; i < ordersToInsert.length; i += chunkSize) {
            const chunk = ordersToInsert.slice(i, i + chunkSize);
            const { error: insertErr } = await supabase
                .from('purchase_orders')
                .upsert(chunk, { onConflict: 'user_id,unique_order_key' });

            if (insertErr) {
                console.error('[savePurchaseDataV2] Error inserting chunk:', insertErr);
                throw insertErr;
            }
        }

        // 4. Cleanup & Track disappeared orders
        // 4a. Find all orders that were NOT in this batch (disappeared from Excel)
        const { data: disappearedOrders, error: findErr } = await supabase
            .from('purchase_orders')
            .select('*')
            .eq('user_id', userId)
            .neq('batch_id', batch.id);

        if (findErr) throw findErr;

        if (disappearedOrders && disappearedOrders.length > 0) {
            // 4b. Filter only those with status '05' to move to processed_orders
            const completedOrders = disappearedOrders.filter(o => o.status === '05');
            
            if (completedOrders.length > 0) {
                const processedToInsert = completedOrders.map(o => ({
                    user_id: o.user_id,
                    pr_number: o.pr_number,
                    item_no: o.item_no,
                    description: o.description,
                    requester: o.requester,
                    quantity: String(o.quantity), // processed_orders stores quantity as text historically
                    unit: o.unit,
                    status: o.status,
                    tag_name: o.tag_name,
                    is_urgent: o.is_urgent,
                    urgent_reason: o.urgent_reason,
                    urgent_image_url: o.urgent_image_url,
                    request_date: o.request_date,
                    // disappeared_at will default to NOW() in DB
                }));

                const { error: trackErr } = await supabase
                    .from('processed_orders')
                    .insert(processedToInsert);

                if (trackErr) {
                    console.error('[savePurchaseDataV2] Error tracking processed orders:', trackErr);
                    // Non-fatal error, but we log it.
                }
            }

            // 4c. Delete ALL disappeared orders from purchase_orders (both 05 and other statuses)
            const { error: delErr } = await supabase
                .from('purchase_orders')
                .delete()
                .eq('user_id', userId)
                .neq('batch_id', batch.id);

            if (delErr) {
                console.error('[savePurchaseDataV2] Error deleting old orders:', delErr);
            }
        }

    } catch (err) {
        // Rollback batch creation if insert fails to prevent empty batches on reload
        await supabase.from('import_batches').delete().eq('id', batch.id);
        throw err;
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

export async function updateUrgentStatus(userId: string, uniqueOrderKey: string, isUrgent: boolean, urgentStatus: 'pending' | 'processing' | 'completed' = 'pending', urgentReason?: string, urgentImageUrl?: string) {
    if (!userId || !uniqueOrderKey) return;

    // Use upsert to handle cases where the row might not exist in purchase_orders yet
    const { error } = await supabase
        .from('purchase_orders')
        .upsert({
            user_id: userId,
            unique_order_key: uniqueOrderKey,
            is_urgent: isUrgent,
            urgent_status: urgentStatus,
            urgent_reason: urgentReason || null,
            urgent_image_url: urgentImageUrl || null,
            // Add stub values for required columns in case this inserts a new row
            batch_id: null,
            pr_number: uniqueOrderKey.split('_')[0] || '',
            item_no: uniqueOrderKey.split('_')[1] || '',
            description: '',
            requester: '',
            quantity: 0,
            unit: '',
            status: '',
            tag_name: ''
        }, { onConflict: 'user_id,unique_order_key' });

    if (error) {
        console.error('[updateUrgentStatus] Error:', error);
        throw error;
    }
}
