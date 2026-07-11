import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PanelRightClose, PanelRight, FileText, Tags, ShoppingCart, Sparkles } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

const COLLAPSED_WIDTH = 52;
const EXPANDED_WIDTH = 220;

const RIGHT_TASK_ITEMS = [
    {
        id: 'system_orders',
        label: 'Đơn hệ thống',
        icon: <FileText size={18} strokeWidth={2} />,
    },
    {
        id: 'material_code',
        label: 'Mã vật tư',
        icon: <Tags size={18} strokeWidth={2} />,
    },
    {
        id: 'purchase_request',
        label: 'Yêu cầu mua hàng',
        icon: <ShoppingCart size={18} strokeWidth={2} />,
    },
    {
        id: 'new_features',
        label: 'Tính năng mới',
        icon: <Sparkles size={18} strokeWidth={2} />,
    },
];

export function RightTaskBar() {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => setIsExpanded((prev) => !prev);

    return (
        <div className="relative shrink-0 h-full z-20" style={{ width: COLLAPSED_WIDTH }}>
            <motion.aside
                initial={false}
                animate={{ width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={cn(
                    'absolute right-0 top-0 bottom-0 flex flex-col',
                    'bg-blue-dark border-l border-white/10',
                    'overflow-hidden shadow-2xl'
                )}
            >
            {/* Toggle button */}
            <div className="flex items-center justify-start p-2">
                <button
                    type="button"
                    onClick={toggleExpanded}
                    aria-label={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
                    title={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
                    className={cn(
                        'flex items-center justify-center',
                        'w-9 h-9 rounded-md',
                        'text-white/80 hover:text-white hover:bg-white/15',
                        'transition-colors'
                    )}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={isExpanded ? 'expanded' : 'collapsed'}
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isExpanded ? (
                                <PanelRightClose size={18} strokeWidth={2} />
                            ) : (
                                <PanelRight size={18} strokeWidth={2} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 mx-2 mb-2" />

            {/* Navigation items */}
            <nav className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto scrollbar-thin">
                {RIGHT_TASK_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={cn(
                            'group relative flex items-center gap-3',
                            'w-full h-10 rounded-md outline-none',
                            'hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-blue-400',
                            'transition-all duration-200 cursor-pointer overflow-hidden',
                            isExpanded ? 'px-3' : 'justify-center'
                        )}
                        title={!isExpanded ? item.label : undefined}
                    >
                        <span className={cn(
                            'flex items-center justify-center shrink-0',
                            'text-white/70 group-hover:text-white transition-colors'
                        )}>
                            {item.icon}
                        </span>

                        <AnimatePresence mode="wait">
                            {isExpanded && (
                                <motion.span
                                    initial={{ opacity: 0, x: -5, width: 0 }}
                                    animate={{ opacity: 1, x: 0, width: 'auto' }}
                                    exit={{ opacity: 0, x: -5, width: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm font-medium text-white/90 whitespace-nowrap overflow-hidden"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                ))}
            </nav>
        </motion.aside>
        </div>
    );
}
