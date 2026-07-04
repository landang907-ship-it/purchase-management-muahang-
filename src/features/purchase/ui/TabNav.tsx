/**
 * Tab navigation – tab chuyển đổi dữ liệu mua hàng.
 */
import { motion } from 'motion/react';
import { cn } from '@/shared/lib/cn';
import { type TabKey } from '@/features/purchase/model/purchase';
import { useTranslation } from '@/i18n/useTranslation';

interface TabNavProps {
    active: TabKey;
    onChange: (tab: TabKey) => void;
    counts: Record<TabKey, number>;
}

const TABS: { key: TabKey; labelKey: string }[] = [
    { key: 'system', labelKey: 'tab.system' },
];

export function TabNav({ active, onChange, counts }: TabNavProps) {
    const { t } = useTranslation();
    return (
        <nav
            role="tablist"
            aria-label={t('tab.ariaLabel')}
            className={cn(
                'fixed inset-x-0 z-40',
                'top-[calc(env(safe-area-inset-top,0px)+64px)] sm:top-[calc(env(safe-area-inset-top,0px)+72px)]',
                'grid grid-cols-4',
                'bg-blue-mid border-b-2 border-blue-dark',
            )}
        >
            {TABS.map((tab) => {
                const isActive = active === tab.key;
                return (
                    <motion.button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        data-tab={tab.key}
                        onClick={() => onChange(tab.key)}
                        whileTap={{ scale: 0.97 }}
                        whileHover={!isActive ? { y: -1 } : undefined}
                        className={cn(
                            'border-0 border-r border-white/15 last:border-r-0',
                            'px-1 py-1 min-h-[36px] sm:min-h-[40px]',
                            'text-[9px] sm:text-[10px] font-semibold leading-tight text-center',
                            'transition-colors',
                            isActive
                                ? 'bg-red text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.2)]'
                                : 'bg-blue-tab text-white hover:bg-blue-light',
                        )}
                    >
                        <span className="block">{t(tab.labelKey)}</span>
                        {counts[tab.key] > 0 && (
                            <span
                                className={cn(
                                    'mt-0.5 inline-block rounded-full px-1 text-[8px] font-bold',
                                    isActive
                                        ? 'bg-white/25 text-white'
                                        : 'bg-white/20 text-white',
                                )}
                            >
                                {counts[tab.key]}
                            </span>
                        )}
                    </motion.button>
                );
            })}
        </nav>
    );
}
