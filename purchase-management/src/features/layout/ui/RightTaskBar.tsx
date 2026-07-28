import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PanelLeftClose, PanelLeft, FileText, Tags, Menu, Home, Shield, User, LogOut, Bell, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';
import { getPendingUrgentRequests, getOverdueOrders } from '@/features/purchase/services/purchaseServiceV2';
import { supabase } from '@/features/purchase/services/supabaseClient';

import { getProfile } from '@/features/auth/services/profile.service';

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 250;

const RIGHT_TASK_ITEMS = [
    {
        id: 'home',
        labelKey: 'sidebar.home',
        icon: <Home size={18} strokeWidth={2} />,
        path: '/dashboard',
    },
    {
        id: 'system_orders',
        labelKey: 'sidebar.system_orders',
        icon: <FileText size={18} strokeWidth={2} />,
        path: '/system-orders',
    },
    {
        id: 'notifications',
        labelKey: 'sidebar.notifications',
        icon: <Bell size={18} strokeWidth={2} />,
        path: '/notifications',
    },
    {
        id: 'material_code',
        labelKey: 'sidebar.material_code',
        icon: <Tags size={18} strokeWidth={2} />,
        path: '/materials',
    },
    {
        id: 'processed_orders',
        labelKey: 'sidebar.processed_orders',
        icon: <FileText size={18} strokeWidth={2} />,
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
    const [urgentCount, setUrgentCount] = useState<number>(0);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user?.user) {
            getProfile(user.user).then(profile => {
                if (profile?.avatar_url) {
                    setAvatarUrl(profile.avatar_url);
                }
            });
        }
    }, [user]);

    useEffect(() => {
        let isMounted = true;

        const fetchCount = async () => {
            try {
                const [urgentList, overdueList] = await Promise.all([
                    getPendingUrgentRequests().catch(() => []),
                    getOverdueOrders().catch(() => []),
                ]);
                const total = (urgentList ? urgentList.length : 0) + (overdueList ? overdueList.length : 0);
                if (isMounted) setUrgentCount(total);
            } catch (err) {
                console.error('[RightTaskBar] error loading urgent count:', err);
            }
        };

        fetchCount();
        const interval = setInterval(fetchCount, 10000);

        const channel = supabase
            .channel('taskbar-urgent-badge')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'purchase_orders' }, () => {
                fetchCount();
            })
            .subscribe();

        return () => {
            isMounted = false;
            clearInterval(interval);
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleExpanded = () => setIsExpanded((prev) => !prev);
    const usernameDisplay = user?.user || 'User';

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                type="button"
                className="md:hidden fixed top-2 left-2.5 z-[60] p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/15 focus:outline-none transition-all active:scale-95 shadow-xs"
                onClick={() => setIsMobileOpen(prev => !prev)}
                aria-label={isMobileOpen ? '─É├│ng menu' : 'Mß╗ƒ menu'}
            >
                <Menu size={22} strokeWidth={2.2} />
            </button>

            {/* Mobile Backdrop Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-[40]"
                    />
                )}
            </AnimatePresence>

            <div 
                className={cn(
                    "relative shrink-0 h-full z-[55] transition-all duration-300",
                    isMobile ? "w-0" : "w-[64px]"
                )}
            >
                <motion.aside
                    initial={false}
                    animate={{ width: isMobile ? EXPANDED_WIDTH : (isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH) }}
                    transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                    className={cn(
                        'absolute left-0 top-0 bottom-0 flex flex-col',
                        'bg-white/95 backdrop-blur-2xl border-r border-slate-200/80',
                        'shadow-[8px_0_30px_rgba(0,0,0,0.04)] overflow-hidden transition-transform duration-300',
                        isMobile && !isMobileOpen ? 'max-md:-translate-x-full' : 'max-md:translate-x-0'
                    )}
                >
                    {/* Top Section Inside Taskbar (Clean & Non-Redundant) */}
                    <div className="flex items-center justify-between p-3 border-b border-slate-100/80 shrink-0">
                        {(isExpanded || isMobile) ? (
                            <div className="flex items-center gap-2 text-slate-500 font-extrabold text-[11px] tracking-wider uppercase px-1">
                                <Sparkles size={14} className="text-blue-500" />
                                <span>DANH Mß╗ñC Hß╗å THß╗ÉNG</span>
                            </div>
                        ) : (
                            <div className="w-full flex justify-center">
                                <Sparkles size={16} className="text-blue-500" />
                            </div>
                        )}

                        {/* Desktop Toggle Button */}
                        <button
                            type="button"
                            onClick={toggleExpanded}
                            aria-label={isExpanded ? 'Thu nhß╗Å' : 'Mß╗ƒ rß╗Öng'}
                            title={isExpanded ? 'Thu nhß╗Å' : 'Mß╗ƒ rß╗Öng'}
                            className={cn(
                                'hidden md:flex items-center justify-center',
                                'w-7 h-7 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100',
                                'transition-all duration-200 shrink-0'
                            )}
                        >
                            {isExpanded ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
                        </button>
                    </div>

                    {/* Navigation Menu Links */}
                    <nav className="flex-1 flex flex-col gap-1.5 p-2.5 overflow-y-auto scrollbar-thin">
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-2 pt-1 pb-0.5 hidden sm:block">
                            {(isExpanded || isMobile) ? 'Menu Ch├¡nh' : 'ΓÇóΓÇóΓÇó'}
                        </div>

                        {RIGHT_TASK_ITEMS.map((item) => {
                            const isNotification = item.id === 'notifications';
                            const isActive = location.pathname === item.path;

                            return (
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
                                        'w-full h-11 rounded-xl outline-none cursor-pointer',
                                        'transition-all duration-200 overflow-hidden',
                                        isExpanded || isMobile ? 'px-3' : 'justify-center',
                                        isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/25 ring-1 ring-blue-400/30'
                                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-blue-600'
                                    )}
                                    title={(!isExpanded && !isMobile) ? t(item.labelKey as any) : undefined}
                                >
                                    {/* Active Left Indicator Bar */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-white rounded-r-full"
                                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                        />
                                    )}

                                    <span className={cn(
                                        'relative flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110',
                                        isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'
                                    )}>
                                        {item.icon}
                                        {isNotification && urgentCount > 0 && (
                                            <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-extrabold text-white shadow-md shadow-red-500/50 ring-2 ring-white animate-pulse z-10">
                                                {urgentCount > 99 ? '99+' : urgentCount}
                                            </span>
                                        )}
                                    </span>

                                    <AnimatePresence mode="wait">
                                        {(isExpanded || isMobile) && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -8 }}
                                                transition={{ duration: 0.15 }}
                                                className={cn(
                                                    "text-xs font-semibold whitespace-nowrap overflow-hidden truncate",
                                                    isActive ? 'text-white font-bold' : 'text-slate-700 group-hover:text-blue-600'
                                                )}
                                            >
                                                {t(item.labelKey as any)}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>
                            );
                        })}

                        {/* Admin Route Option */}
                        {user?.role === 'admin' && (
                            <button
                                type="button"
                                onClick={() => {
                                    navigate('/admin/users');
                                    if (isMobile) setIsMobileOpen(false);
                                }}
                                className={cn(
                                    'group relative flex items-center gap-3',
                                    'w-full h-11 rounded-xl outline-none cursor-pointer',
                                    'transition-all duration-200 overflow-hidden',
                                    isExpanded || isMobile ? 'px-3' : 'justify-center',
                                    location.pathname === '/admin/users'
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-md shadow-amber-500/25 ring-1 ring-amber-400/30'
                                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-amber-600'
                                )}
                                title={(!isExpanded && !isMobile) ? t('action.admin') : undefined}
                            >
                                <span className={cn(
                                    'flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110',
                                    location.pathname === '/admin/users' ? 'text-white' : 'text-slate-500 group-hover:text-amber-600'
                                )}>
                                    <Shield size={18} strokeWidth={2} />
                                </span>
                                {(isExpanded || isMobile) && (
                                    <span className={cn(
                                        "text-xs font-semibold whitespace-nowrap overflow-hidden truncate",
                                        location.pathname === '/admin/users' ? 'text-white font-bold' : 'text-slate-700'
                                    )}>
                                        {t('action.admin')}
                                    </span>
                                )}
                            </button>
                        )}
                        
                        {mobileActions && (
                            <div className="md:hidden flex flex-col gap-1.5 pt-2 border-t border-slate-200/60 mt-1">
                                {mobileActions}
                            </div>
                        )}

                        {/* User Profile Mini-Card at Bottom */}
                        <div className="mt-auto pt-3 border-t border-slate-200/80 flex flex-col gap-1">
                            {/* User Info Bar */}
                            <div 
                                onClick={() => {
                                    navigate('/profile');
                                    if (isMobile) setIsMobileOpen(false);
                                }}
                                className={cn(
                                    "flex items-center gap-2.5 p-2 rounded-xl cursor-pointer hover:bg-slate-100/80 transition-colors border border-transparent hover:border-slate-200/60",
                                    isExpanded || isMobile ? "" : "justify-center"
                                )}
                                title={usernameDisplay}
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        usernameDisplay.slice(0, 2).toUpperCase()
                                    )}
                                </div>

                                {(isExpanded || isMobile) && (
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-xs font-bold text-slate-800 truncate">
                                            {usernameDisplay}
                                        </span>
                                        <span className="text-[10px] text-slate-500 capitalize flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-ping" />
                                            {user?.role || 'User'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Quick Profile & Logout Actions */}
                            {(isExpanded || isMobile) && (
                                <div className="grid grid-cols-2 gap-1.5 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigate('/profile');
                                            if (isMobile) setIsMobileOpen(false);
                                        }}
                                        className="flex items-center justify-center gap-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors"
                                    >
                                        <User size={13} />
                                        {t('action.profile')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            logout();
                                            if (isMobile) setIsMobileOpen(false);
                                        }}
                                        className="flex items-center justify-center gap-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold rounded-lg transition-colors"
                                    >
                                        <LogOut size={13} />
                                        {t('header.logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </nav>
                </motion.aside>
            </div>
        </>
    );
}
