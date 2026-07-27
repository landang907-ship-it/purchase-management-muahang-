import { supabase } from './supabaseClient';
import type { PurchaseRow } from './excel';
import { parseDateSafe } from '@/features/purchase/lib/date';

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
    urgent_status?: 'pending' | 'approved' | 'processing' | 'completed';
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

    // 3. Insert in chunks of 500 in parallel batches (3 chunks at a time) to maximize throughput
    const chunkSize = 500;
    const chunks: Array<typeof ordersToInsert> = [];
    for (let i = 0; i < ordersToInsert.length; i += chunkSize) {
        chunks.push(ordersToInsert.slice(i, i + chunkSize));
    }

    try {
        const concurrencyLimit = 3;
        for (let i = 0; i < chunks.length; i += concurrencyLimit) {
            const batchOfChunks = chunks.slice(i, i + concurrencyLimit);
            const results = await Promise.all(
                batchOfChunks.map((chunk) =>
                    supabase.from('purchase_orders').upsert(chunk, { onConflict: 'user_id,unique_order_key' })
                )
            );

            for (const res of results) {
                if (res.error) {
                    console.error('[savePurchaseDataV2] Error inserting chunk:', res.error);
                    throw res.error;
                }
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

export async function updateUrgentStatus(userId: string, uniqueOrderKey: string, isUrgent: boolean, urgentStatus: 'pending' | 'approved' | 'processing' | 'completed' = 'pending', urgentReason?: string, urgentImageUrl?: string) {
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


/**
 * Fetch all pending urgent requests for notifications page
 */
export async function getPendingUrgentRequests(): Promise<PurchaseOrder[]> {
    let query = supabase
        .from('purchase_orders')
        .select('*')
        .eq('is_urgent', true)
        .eq('urgent_status', 'pending')
        .order('created_at', { ascending: false });

    // Removed filtering by tag_name so everyone can see all pending requests
    // (Approval logic is handled in the UI instead)
    const { data, error } = await query;

    if (error) {
        console.error('[getPendingUrgentRequests] Error:', error);
        throw error;
    }
    return data as PurchaseOrder[];
}

/**
 * Fetch all unapproved/rejected orders that are overdue by more than 10 days
 * OR rejected within the last 30 days.
 */
export async function getOverdueOrders(): Promise<PurchaseOrder[]> {
    try {
        // 1. Fetch latest imported Excel file from purchase_records (AUTHORITATIVE current order statuses)
        const { data: v1Record } = await supabase
            .from('purchase_records')
            .select('data, imported_at')
            .order('imported_at', { ascending: false })
            .limit(1);

        // 2. Fetch metadata from purchase_orders (V2 table)
        const { data: v2Data } = await supabase
            .from('purchase_orders')
            .select('*');

        const v2Map = new Map<string, PurchaseOrder>();
        if (v2Data) {
            for (const o of v2Data) {
                v2Map.set(o.unique_order_key, o as PurchaseOrder);
            }
        }

        const map = new Map<string, PurchaseOrder>();
        const processedKeys = new Set<string>(); // Tracks all keys evaluated in the latest Excel file

        // Process latest Excel record rows FIRST (The primary source of truth for status)
        if (v1Record && v1Record[0]?.data) {
            const rows = v1Record[0].data as any[];
            for (const r of rows) {
                const prNumber = String(r['Yc.m.hàng'] || r.pr_number || '').trim();
                const itemNo = String(r['Vật tư'] || r.item_no || '').trim();
                if (!prNumber && !itemNo) continue;

                const uniqueKey = `${prNumber}_${itemNo}`;
                processedKeys.add(uniqueKey); // Record key as present in latest Excel file

                const status = String(r['T.trg xử lý'] || r.status || '').trim();
                
                // If status in the latest Excel file is APPROVED ('05' / '5' / 'ĐÃ DUYỆT'), DO NOT ADD TO OVERDUE!
                const statusUpper = status.toUpperCase();
                const isApproved = status === '5' || status === '05' || statusUpper.includes('ĐÃ DUYỆT') || statusUpper.includes('DA DUYET') || statusUpper.includes('APPROV') || status.includes('已批准');
                if (isApproved) continue;

                const requestDate = String(r['Ngày YC'] || r.request_date || '').trim();
                const requester = String(r['Ng.yêu cầu'] || r.requester || '').trim();
                const description = String(r['Văn bản ngắn'] || r.description || '').trim();
                const tagName = String(r['TAG-NAME'] || r.tag_name || '').trim();
                const quantity = Number(r['Số lượng'] || r.quantity || 0);
                const unit = String(r['Đơn vị'] || r['Đơn vị đo lường'] || r.unit || '').trim();

                const v2Item = v2Map.get(uniqueKey);

                map.set(uniqueKey, {
                    id: uniqueKey,
                    user_id: 'default',
                    batch_id: 'v1_record',
                    unique_order_key: uniqueKey,
                    pr_number: prNumber,
                    item_no: itemNo,
                    description,
                    requester,
                    quantity,
                    unit,
                    status,
                    tag_name: tagName,
                    request_date: requestDate,
                    created_at: v1Record[0].imported_at || new Date().toISOString(),
                    is_urgent: v2Item ? v2Item.is_urgent : Boolean(r.is_urgent),
                    urgent_reason: v2Item ? v2Item.urgent_reason : (r.urgent_reason || null),
                    urgent_image_url: v2Item ? v2Item.urgent_image_url : (r.urgent_image_url || null),
                    urgent_status: v2Item ? v2Item.urgent_status : (r.urgent_status || 'pending')
                });
            }
        }

        // Map remaining active orders strictly from the latest Excel file (matching Purchase Page 100%)
        // Do not add ghost orders from old CSDL batches that do not exist in the current Excel file
        const allOrders = Array.from(map.values());

        // Filter: Pending orders overdue between 10 and 60 days OR Rejected orders within 60 days
        return allOrders.filter(order => {
            const s = (order.status || '').trim();
            const sUpper = s.toUpperCase();
            const isApproved = s === '5' || s === '05' || sUpper.includes('ĐÃ DUYỆT') || sUpper.includes('DA DUYET') || sUpper.includes('APPROV') || s.includes('已批准');
            if (isApproved) return false;

            const dateStr = order.request_date || order.created_at;
            const days = calculateDaysOverdue(dateStr);

            // If date is invalid or in the future
            if (days < 0) return false;

            const isRejected = s === '8' || s === '08' || sUpper.includes('TỪ CHỐI') || sUpper.includes('TU CHOI') || sUpper.includes('HỦY') || sUpper.includes('HUY') || sUpper.includes('BÁC') || sUpper.includes('REJECT') || sUpper.includes('DISAPPROV') || s.includes('已拒绝');
            if (isRejected) {
                // Rejected orders: show all rejected orders in the last 60 days
                return days <= 60;
            }

            // Pending approval: between 10 and 60 days overdue
            return days > 10 && days <= 60;
        });
    } catch (err) {
        console.error('[getOverdueOrders] Error:', err);
        return [];
    }
}

export function calculateDaysOverdue(dateStr?: string | null): number {
    if (!dateStr) return -1;
    const reqDate = parseDateSafe(dateStr);
    if (!reqDate || isNaN(reqDate.getTime())) return -1;

    const now = new Date();
    const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfReq = new Date(reqDate.getFullYear(), reqDate.getMonth(), reqDate.getDate());

    const diffMs = startOfNow.getTime() - startOfReq.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}


