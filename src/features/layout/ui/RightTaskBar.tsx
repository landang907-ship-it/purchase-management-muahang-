import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PanelLeftClose, PanelLeft, FileText, Tags, Menu, Home, Shield, User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';

const COLLAPSED_WIDTH = 60;
const EXPANDED_WIDTH = 220;

const RIGHT_TASK_ITEMS = [
    {
        id: 'home',
        labelKey: 'sidebar.home',
        icon: <Home size={16} strokeWidth={2} />,
        path: '/dashboard',
    },
    {
        id: 'system_orders',
        labelKey: 'sidebar.system_orders',
        icon: <FileText size={16} strokeWidth={2} />,
        path: '/system-orders',
    },
    {
        id: 'material_code',
        labelKey: 'sidebar.material_code',
        icon: <Tags size={16} strokeWidth={2} />,
        path: '/materials',
    },
    {
        id: 'processed_orders',
        labelKey: 'sidebar.processed_orders',
        icon: <FileText size={16} strokeWidth={2} />,
        path: '/processed-orders',
    },
];

interface RightTaskBarProps {
    mobileActions?: React.ReactNode;
}

export function RightTaskBar({ mobileActions }: RightTaskBarProps = {}) {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
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
                    isMobile ? "w-0" : "w-[60px]"
                )}
            >
                <motion.aside
                    initial={false}
                    animate={{ width: isMobile ? EXPANDED_WIDTH : (isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH) }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className={cn(
                        'absolute left-0 top-0 bottom-0 flex flex-col',
                        'bg-white/70 border-r border-slate-200/50 backdrop-blur-xl',
                        'overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300',
                        isMobile && !isMobileOpen ? 'max-md:-translate-x-full' : 'max-md:translate-x-0'
                    )}
                >
                    {/* Toggle button - hidden on mobile since it's always expanded off-canvas */}
                    <div className="hidden md:flex items-center justify-start p-3">
                        <button
                            type="button"
                            onClick={toggleExpanded}
                            aria-label={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
                            title={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
                            className={cn(
                                'flex items-center justify-center',
                                'w-9 h-9 rounded-xl',
                                'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60',
                                'transition-all duration-200'
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

                    <div className="h-px bg-slate-200/50 mx-4 mb-3 mt-1" />

                    <nav className="flex-1 flex flex-col gap-1.5 px-3 py-2 overflow-y-auto scrollbar-thin">
                        {RIGHT_TASK_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    if (item.path) {
                                        navigate(item.path);
                                        if (isMobile) setIsMobileOpen(false);
                                    }
                                }}
                                className={cn(
                                    'group relative flex items-center gap-3',
                                    'w-full h-10 rounded-xl outline-none',
                                    'hover:bg-slate-100/60 focus-visible:ring-2 focus-visible:ring-blue-400',
                                    'transition-all duration-200 cursor-pointer overflow-hidden',
                                    isExpanded || isMobile ? 'px-3.5' : 'justify-center',
                                    location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-slate-600 group-hover:text-slate-900'
                                )}
                                title={(!isExpanded && !isMobile) ? t(item.labelKey as any) : undefined}
                            >
                                <span className={cn(
                                    'relative flex items-center justify-center shrink-0 transition-colors',
                                    location.pathname === item.path ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-900'
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
                                            className={cn(
                                                "text-sm font-medium whitespace-nowrap overflow-hidden",
                                                location.pathname === item.path ? 'text-blue-600 font-semibold' : 'text-slate-700'
                                            )}
                                        >
                                            {t(item.labelKey as any)}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        ))}
                        
                        <div className="mt-auto flex flex-col gap-1.5 pt-3 border-t border-slate-200/50">
                            {user?.role === 'admin' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate('/admin/users');
                                        if (isMobile) setIsMobileOpen(false);
                                    }}
                                    className={cn(
                                        'group relative flex items-center gap-3',
                                        'w-full h-10 rounded-xl outline-none',
                                        'hover:bg-slate-100/60 focus-visible:ring-2 focus-visible:ring-blue-400',
                                        'transition-all duration-200 cursor-pointer overflow-hidden',
                                        isExpanded || isMobile ? 'px-3.5' : 'justify-center',
                                        location.pathname === '/admin/users' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 group-hover:text-slate-900'
                                    )}
                                    title={(!isExpanded && !isMobile) ? t('action.admin') : undefined}
                                >
                                    <span className={cn(
                                        'flex items-center justify-center shrink-0 transition-colors',
                                        location.pathname === '/admin/users' ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-900'
                                    )}>
                                        <Shield size={16} strokeWidth={2} />
                                    </span>
                                    <AnimatePresence mode="wait">
                                        {(isExpanded || isMobile) && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -5, width: 0 }}
                                                animate={{ opacity: 1, x: 0, width: 'auto' }}
                                                exit={{ opacity: 0, x: -5, width: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className={cn(
                                                    "text-sm font-medium whitespace-nowrap overflow-hidden",
                                                    location.pathname === '/admin/users' ? 'text-blue-600 font-semibold' : 'text-slate-700'
                                                )}
                                            >
                                                {t('action.admin')}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>
                            )}
                            
                            <button
                                type="button"
                                onClick={() => {
                                    navigate('/profile');
                                    if (isMobile) setIsMobileOpen(false);
                                }}
                                className={cn(
                                    'group relative flex items-center gap-3',
                                    'w-full h-10 rounded-xl outline-none',
                                    'hover:bg-slate-100/60 focus-visible:ring-2 focus-visible:ring-blue-400',
                                    'transition-all duration-200 cursor-pointer overflow-hidden',
                                    isExpanded || isMobile ? 'px-3.5' : 'justify-center',
                                    location.pathname === '/profile' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 group-hover:text-slate-900'
                                )}
                                title={(!isExpanded && !isMobile) ? t('action.profile') : undefined}
                            >
                                <span className={cn(
                                    'flex items-center justify-center shrink-0 transition-colors',
                                    location.pathname === '/profile' ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-900'
                                )}>
                                    <User size={16} strokeWidth={2} />
                                </span>
                                <AnimatePresence mode="wait">
                                    {(isExpanded || isMobile) && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -5, width: 0 }}
                                            animate={{ opacity: 1, x: 0, width: 'auto' }}
                                            exit={{ opacity: 0, x: -5, width: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className={cn(
                                                "text-sm font-medium whitespace-nowrap overflow-hidden",
                                                location.pathname === '/profile' ? 'text-blue-600 font-semibold' : 'text-slate-700'
                                            )}
                                        >
                                            {t('action.profile')}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    logout();
                                    if (isMobile) setIsMobileOpen(false);
                                }}
                                className={cn(
                                    'group relative flex items-center gap-3',
                                    'w-full h-10 rounded-xl outline-none',
                                    'hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-400',
                                    'transition-all duration-200 cursor-pointer overflow-hidden',
                                    isExpanded || isMobile ? 'px-3.5' : 'justify-center',
                                    'text-slate-600 hover:text-red-600'
                                )}
                                title={(!isExpanded && !isMobile) ? t('header.logout') : undefined}
                            >
                                <span className="flex items-center justify-center shrink-0 transition-colors text-slate-500 group-hover:text-red-500">
                                    <LogOut size={16} strokeWidth={2} />
                                </span>
                                <AnimatePresence mode="wait">
                                    {(isExpanded || isMobile) && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -5, width: 0 }}
                                            animate={{ opacity: 1, x: 0, width: 'auto' }}
                                            exit={{ opacity: 0, x: -5, width: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-sm font-medium whitespace-nowrap overflow-hidden text-slate-700 group-hover:text-red-600"
                                        >
                                            {t('header.logout')}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                        
                        {mobileActions && (
                            <div className="md:hidden flex flex-col gap-1.5 pt-3 border-t border-slate-200/50">
                                {mobileActions}
                            </div>
                        )}
                    </nav>
                </motion.aside>
            </div>
        </>
    );
}
