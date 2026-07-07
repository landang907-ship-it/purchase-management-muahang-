/**
 * Type definitions for the purchase management module.
 */
import type { PurchaseRow, ParseResult } from '@/features/purchase/services/excel';

// Re-export shared toast types so existing imports keep working.
export type { ToastVariant, ToastMessage } from '@/shared/model/toast';

export type TabKey = 'system';

export interface TabDef {
    key: TabKey;
    label: string;
    shortLabel: string;
}

export const TABS: TabDef[] = [
    { key: 'system', label: 'Hệ thống', shortLabel: 'HT' },
];

export type { PurchaseRow, ParseResult };
