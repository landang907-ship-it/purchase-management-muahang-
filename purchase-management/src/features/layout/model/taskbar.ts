/**
 * TaskBar model – type definitions for the left sidebar task bar.
 */

export interface TaskBarItem {
    id: string;
    labelKey: string;
    labelKeyZh: string;
    icon: string; // lucide icon name
    action?: () => void;
    disabled?: boolean;
}

export interface TaskBarState {
    isExpanded: boolean;
}
