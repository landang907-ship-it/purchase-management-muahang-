import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/features/purchase/services/supabaseClient';

export function useUrgentCount(userId: string | undefined) {
    const { data: count = 0 } = useQuery({
        queryKey: ['urgentCount', userId],
        queryFn: async () => {
            if (!userId) return 0;
            
            // Count orders that are marked as urgent and have both reason and image
            const { count: urgentCount, error } = await supabase
                .from('purchase_orders')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('is_urgent', true)
                .not('urgent_reason', 'is', null)
                .not('urgent_image_url', 'is', null);

            if (error) {
                console.error('Error fetching urgent count:', error);
                return 0;
            }

            return urgentCount || 0;
        },
        enabled: !!userId,
        refetchInterval: 30000, // Optional: Poll every 30s to keep badge updated
    });

    return count;
}
