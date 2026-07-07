/**
 * TaskBarItem – individual button inside the TaskBar sidebar.
 */
import { motion } from 'motion/react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';
import * as Icons from 'lucide-react';

interface TaskBarItemProps {
    icon: keyof typeof Icons;
    labelKey: string;
    labelKeyZh: string;
    isExpanded: boolean;
    isActive?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

export function TaskBarItem({
    icon,
    labelKey,
    labelKeyZh,
    isExpanded,
    isActive = false,
    disabled = false,
    onClick,
}: TaskBarItemProps) {
    const { lang } = useTranslation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = Icons[icon] as React.ComponentType<any>;

    if (!IconComponent) {
        console.warn(`Icon "${icon}" not found in lucide-react`);
        return null;
    }

    return (
        <motion.button
            type="button"
            onClick={onClick}
            disabled={disabled}
            whileTap={!disabled ? { scale: 0.95 } : undefined}
            whileHover={!disabled && !isActive ? { x: 2 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={cn(
                'group relative flex items-center gap-2',
                'w-full min-h-[44px] px-2',
                'rounded-md transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                isActive
                    ? 'bg-red text-white'
                    : 'text-white/90 hover:bg-white/15 hover:text-white',
                disabled && 'opacity-40 cursor-not-allowed',
            )}
            aria-label={lang === 'ZH' ? labelKeyZh : labelKey}
            title={lang === 'ZH' ? labelKeyZh : labelKey}
        >
            <IconComponent
                size={18}
                strokeWidth={2}
                className={cn(
                    'shrink-0 transition-transform',
                    isExpanded ? '' : 'group-hover:scale-110',
                )}
            />
            {isExpanded && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="truncate text-[13px] font-semibold whitespace-nowrap"
                >
                    {lang === 'ZH' ? labelKeyZh : labelKey}
                </motion.span>
            )}
        </motion.button>
    );
}
