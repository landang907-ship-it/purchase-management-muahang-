/**
 * Status badge helper - maps status text to a Tailwind color class.
 */
export type BadgeVariant = 'green' | 'orange' | 'red' | 'blue' | 'gray';

export const BADGE_CLASSES: Record<BadgeVariant, string> = {
    green: 'bg-emerald-100 text-emerald-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-neutral-100 text-neutral-700',
};

import { getStatusColorClass } from '../lib/status';

export function statusVariant(val: string | undefined | null): string {
    if (!val) return 'bg-neutral-500';
    return getStatusColorClass(val);
}
