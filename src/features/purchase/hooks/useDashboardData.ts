import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient';
import { formatStatusText } from '../lib/status';

export interface DashboardStats {
    activeCount: number;
    processedCount: number;
    statusDistribution: { name: string; value: number }[];
    completionTrend: { date: string; count: number }[];
    topRequesters: { name: string; count: number }[];
}

export function useDashboardData(userId: string | undefined) {
    return useQuery({
        queryKey: ['dashboardData', userId],
        queryFn: async (): Promise<DashboardStats> => {
            if (!userId) throw new Error('No user ID');

            // 1. Fetch active orders
            const { data: activeOrders, error: activeErr } = await supabase
                .from('purchase_orders')
                .select('status, requester')
                .eq('user_id', userId);

            if (activeErr) throw activeErr;

            // 2. Fetch processed orders (last 30 days for trend)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            // To get total processed count efficiently
            const { count: totalProcessed, error: countErr } = await supabase
                .from('processed_orders')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            if (countErr) throw countErr;

            // To get trend data
            const { data: recentProcessed, error: trendErr } = await supabase
                .from('processed_orders')
                .select('disappeared_at')
                .eq('user_id', userId)
                .gte('disappeared_at', thirtyDaysAgo.toISOString());

            if (trendErr) throw trendErr;

            // --- Compute Aggregations ---

            // A. Status Distribution (Active Orders)
            const statusMap = new Map<string, number>();
            const requesterMap = new Map<string, number>();

            (activeOrders || []).forEach(order => {
                // Status
                const st = formatStatusText(order.status || 'Khác');
                statusMap.set(st, (statusMap.get(st) || 0) + 1);
                
                // Requester
                const req = order.requester || 'N/A';
                requesterMap.set(req, (requesterMap.get(req) || 0) + 1);
            });

            const statusDistribution = Array.from(statusMap.entries())
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value);

            // B. Top Requesters
            const topRequesters = Array.from(requesterMap.entries())
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5); // top 5

            // C. Completion Trend (Last 7-14 days grouping)
            const trendMap = new Map<string, number>();
            
            // Initialize last 7 days with 0 to ensure continuous chart
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                trendMap.set(dateStr, 0);
            }

            (recentProcessed || []).forEach(order => {
                if (order.disappeared_at) {
                    const d = new Date(order.disappeared_at);
                    const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                    if (trendMap.has(dateStr)) {
                        trendMap.set(dateStr, trendMap.get(dateStr)! + 1);
                    }
                }
            });

            const completionTrend = Array.from(trendMap.entries()).map(([date, count]) => ({
                date,
                count
            }));

            return {
                activeCount: activeOrders?.length || 0,
                processedCount: totalProcessed || 0,
                statusDistribution,
                completionTrend,
                topRequesters
            };
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // cache for 5 minutes
    });
}
