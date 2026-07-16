import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PanelLeftClose, PanelLeft, FileText, Tags, ShoppingCart, Sparkles, Menu } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';

const COLLAPSED_WIDTH = 44;
const EXPANDED_WIDTH = 180;

const RIGHT_TASK_ITEMS = [
    {
        id: 'system_orders',
        labelKey: 'sidebar.system_orders',
        icon: <FileText size={16} strokeWidth={2} />,
    },
    {
        id: 'material_code',
        labelKey: 'sidebar.material_code',
        icon: <Tags size={16} strokeWidth={2} />,
    },
    {
        id: 'purchase_request',
        labelKey: 'sidebar.purchase_request',
        icon: <ShoppingCart size={16} strokeWidth={2} />,
    },
    {
        id: 'new_features',
        labelKey: 'sidebar.new_features',
        icon: <Sparkles size={16} strokeWidth={2} />,
    },
];

interface RightTaskBarProps {
    mobileActions?: React.ReactNode;
}

export function RightTaskBar({ mobileActions }: RightTaskBarProps = {}) {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); // Init on mount
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleExpanded = () => setIsExpanded((prev) => !prev);

    return (
        <>
            {/* Mobile Hamburger Button (placed in header area) */}
            <button
                type="button"
                className="md:hidden fixed top-1.5 left-2 z-[60] p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/15 focus:outline-none"
                onClick={() => setIsMobileOpen(prev => !prev)}
                aria-label={isMobileOpen ? 'Đóng menu' : 'Mở menu'}
            >
                <Menu size={24} />
            </button>

            {/* Mobile Backdrop - relative to main content area so it doesn't cover header */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden absolute inset-0 bg-black/50 z-[40]"
                    />
                )}
            </AnimatePresence>

            <div 
                className={cn(
                    "relative shrink-0 h-full z-[55] transition-all duration-300",
                    isMobile ? "w-0" : "w-[44px]"
                )}
            >
                <motion.aside
                    initial={false}
                    animate={{ width: isMobile ? EXPANDED_WIDTH : (isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH) }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className={cn(
                        'absolute left-0 top-0 bottom-0 flex flex-col',
                        'bg-yellow-50 border-r border-yellow-200',
                        'overflow-hidden shadow-2xl transition-transform duration-300',
                        isMobile && !isMobileOpen ? 'max-md:-translate-x-full' : 'max-md:translate-x-0'
                    )}
                >
                    {/* Toggle button - hidden on mobile since it's always expanded off-canvas */}
                    <div className="hidden md:flex items-center justify-start p-2">
                        <button
                            type="button"
                            onClick={toggleExpanded}
                            aria-label={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
                            title={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
                            className={cn(
                                'flex items-center justify-center',
                                'w-8 h-8 rounded-md',
                                'text-gray-600 hover:text-gray-900 hover:bg-yellow-100',
                                'transition-colors'
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
                                        <PanelLeftClose size={16} strokeWidth={2} />
                                    ) : (
                                        <PanelLeft size={16} strokeWidth={2} />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-yellow-200/60 mx-2 mb-2" />

                    {/* Navigation items */}
                    <nav className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto scrollbar-thin">
                        {RIGHT_TASK_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={cn(
                                    'group relative flex items-center gap-3',
                                    'w-full h-8 rounded-md outline-none',
                                    'hover:bg-yellow-100 focus-visible:ring-2 focus-visible:ring-yellow-400',
                                    'transition-all duration-200 cursor-pointer overflow-hidden',
                                    isExpanded || isMobile ? 'px-3' : 'justify-center'
                                )}
                                title={(!isExpanded && !isMobile) ? t(item.labelKey as any) : undefined}
                            >
                                <span className={cn(
                                    'flex items-center justify-center shrink-0',
                                    'text-gray-600 group-hover:text-gray-900 transition-colors'
                                )}>
                                    {item.icon}
                                </span>

                                <AnimatePresence mode="wait">
                                    {(isExpanded || isMobile) && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -5, width: 0 }}
                                            animate={{ opacity: 1, x: 0, width: 'auto' }}
                                            exit={{ opacity: 0, x: -5, width: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-sm font-medium text-gray-800 whitespace-nowrap overflow-hidden"
                                        >
                                            {t(item.labelKey as any)}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        ))}
                        
                        {mobileActions && (
                            <div className="md:hidden mt-auto flex flex-col gap-1 pt-2 border-t border-yellow-200/60">
                                {mobileActions}
                            </div>
                        )}
                    </nav>
                </motion.aside>
            </div>
        </>
    );
}
