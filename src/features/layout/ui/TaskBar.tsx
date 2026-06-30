/**
 * TaskBar – collapsible left sidebar with navigation items.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { TaskBarItem } from './TaskBarItem';

const COLLAPSED_WIDTH = 52;
const EXPANDED_WIDTH = 180;

const TASK_ITEMS = [
    {
        id: 'account',
        labelKey: 'Quản lý tài khoản',
        labelKeyZh: '账户管理',
        icon: 'User' as const,
    },
    {
        id: 'feature1',
        labelKey: 'Tính năng mới 1',
        labelKeyZh: '新功能 1',
        icon: 'Sparkles' as const,
    },
    {
        id: 'feature2',
        labelKey: 'Tính năng mới 2',
        labelKeyZh: '新功能 2',
        icon: 'Sparkles' as const,
    },
];

interface TaskBarProps {
    onAccountClick?: () => void;
    userLabel?: string;
}

export function TaskBar({ onAccountClick, userLabel }: TaskBarProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpanded = () => setIsExpanded((prev) => !prev);

    const handleItemClick = (id: string) => {
        if (id === 'account' && onAccountClick) {
            onAccountClick();
        }
        // Other items: placeholder – will be implemented later
    };

    // Filter items: "Quản lý tài khoản" only visible for admin123
    const isAdmin = userLabel === 'admin123';
    const visibleItems = TASK_ITEMS.filter((item) => {
        if (item.id === 'account') return isAdmin;
        return true;
    });

    return (
        <motion.aside
            initial={false}
            animate={{ width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
                'relative shrink-0 flex flex-col',
                'bg-blue-dark border-r border-white/10',
                'overflow-hidden',
            )}
            style={{
                height: 'calc(100vh - env(safe-area-inset-top, 0px) - 64px - 48px)',
                marginTop: 'calc(env(safe-area-inset-top, 0px) + 64px + 48px)',
            }}
        >
            {/* Toggle button */}
            <div className="flex items-center justify-end p-1">
                <button
                    type="button"
                    onClick={toggleExpanded}
                    aria-label={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
                    title={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
                    className={cn(
                        'flex items-center justify-center',
                        'w-9 h-9 rounded-md',
                        'text-white/80 hover:text-white hover:bg-white/15',
                        'transition-colors',
                    )}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={isExpanded ? 'expanded' : 'collapsed'}
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isExpanded ? (
                                <PanelLeftClose size={18} strokeWidth={2} />
                            ) : (
                                <PanelLeft size={18} strokeWidth={2} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 mx-2" />

            {/* Navigation items */}
            <nav className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto scrollbar-thin">
                {visibleItems.map((item) => (
                    <TaskBarItem
                        key={item.id}
                        icon={item.icon}
                        labelKey={item.labelKey}
                        labelKeyZh={item.labelKeyZh}
                        isExpanded={isExpanded}
                        onClick={() => handleItemClick(item.id)}
                    />
                ))}
            </nav>

            {/* Decorative bottom gradient */}
            <div
                className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
                style={{
                    background: 'linear-gradient(to top, rgba(26,58,107,0.8) 0%, transparent 100%)',
                }}
            />
        </motion.aside>
    );
}
