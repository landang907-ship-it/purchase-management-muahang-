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

export function statusVariant(val: string | undefined | null): BadgeVariant {
    if (!val) return 'gray';
    const v = val.toLowerCase();
    if (v.includes('hoàn') || v.includes('xong') || v.includes('done') || v.includes('complete'))
        return 'green';
    if (v.includes('quá hạn') || v.includes('overdue') || v.includes('trễ')) return 'red';
    if (v.includes('đang') || v.includes('processing') || v.includes('chờ') || v.includes('pending'))
        return 'orange';
    if (v.includes('mới') || v.includes('new') || v.includes('tạo')) return 'blue';
    return 'gray';
}
