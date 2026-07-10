/**
 * Header – fixed top bar with title, import button, and logout.
 */
import { LogOut, Upload, Settings, User, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';

interface HeaderProps {
    onImport: () => void;
    onLogout: () => void;
    onSettings?: () => void;
    onProfile?: () => void;
    onAdmin?: () => void;
    userLabel?: string;
}

export function Header({ onImport, onLogout, onSettings, onProfile, onAdmin, userLabel }: HeaderProps) {
    const { t } = useTranslation();
    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50',
                'bg-blue-dark text-white shadow-lg',
                'pt-[env(safe-area-inset-top,0px)]',
            )}
        >
            <div className="flex items-center justify-between gap-2 px-2 py-1.5 min-h-[48px] sm:min-h-[56px]">
                <div className="flex-1 min-w-0 leading-tight">
                    <h1 className="text-[14px] sm:text-[15px] md:text-[16px] font-extrabold tracking-wide uppercase truncate">
                        {t('header.title')}
                    </h1>
                    <p className="text-[10px] sm:text-[11px] font-semibold opacity-90 truncate">
                        {t('header.subtitle')}
                        {userLabel ? (
                            <span className="ml-1 opacity-75">· {userLabel}</span>
                        ) : null}
                    </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                    <motion.button
                        type="button"
                        onClick={onImport}
                        aria-label={t('empty.button')}
                        title={t('empty.button')}
                        whileTap={{ scale: 0.92 }}
                        whileHover={{ y: -1, scale: 1.03 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                        className={cn(
                            'flex items-center gap-1.5',
                            'bg-red text-white border border-red/50 rounded',
                            'px-2.5 sm:px-3',
                            'h-7 sm:h-8',
                            'text-[11px] sm:text-[12px] font-semibold',
                            'shadow-[0_1px_6px_rgba(239,68,68,0.4)]',
                            'hover:brightness-110',
                            'transition-[filter]',
                        )}
                    >
                        <Upload size={12} strokeWidth={2.5} />
                        <span className="hidden sm:inline">{t('empty.button')}</span>
                    </motion.button>
                    {onSettings && (
                        <motion.button
                            type="button"
                            onClick={onSettings}
                            aria-label={t('workshop.panelTitle')}
                            title={t('workshop.panelTitle')}
                            whileTap={{ scale: 0.92 }}
                            whileHover={{ y: -1, scale: 1.03 }}
                            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                            className={cn(
                                'flex items-center justify-center',
                                'bg-white/15 text-white border border-white/20 rounded',
                                'w-7 h-7 sm:w-8 sm:h-8',
                                'shadow-[0_1px_6px_rgba(0,0,0,0.15)]',
                                'hover:bg-white/25',
                                'transition-colors',
                            )}
                        >
                            <Settings size={14} strokeWidth={2.5} />
                        </motion.button>
                    )}
                    {onAdmin && (
                        <motion.button
                            type="button"
                            onClick={onAdmin}
                            aria-label="Admin Dashboard"
                            title="Admin Dashboard"
                            whileTap={{ scale: 0.92 }}
                            whileHover={{ y: -1, scale: 1.03 }}
                            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                            className={cn(
                                'flex items-center justify-center',
                                'bg-purple-600/50 text-white border border-purple-500/50 rounded',
                                'w-7 h-7 sm:w-8 sm:h-8',
                                'shadow-[0_1px_6px_rgba(147,51,234,0.3)]',
                                'hover:bg-purple-600/70',
                                'transition-colors',
                            )}
                        >
                            <Shield size={14} strokeWidth={2.5} />
                        </motion.button>
                    )}
                    {onProfile && (
                        <motion.button
                            type="button"
                            onClick={onProfile}
                            aria-label="Profile"
                            title="Profile"
                            whileTap={{ scale: 0.92 }}
                            whileHover={{ y: -1, scale: 1.03 }}
                            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                            className={cn(
                                'flex items-center justify-center',
                                'bg-white/15 text-white border border-white/20 rounded',
                                'w-7 h-7 sm:w-8 sm:h-8',
                                'shadow-[0_1px_6px_rgba(0,0,0,0.15)]',
                                'hover:bg-white/25',
                                'transition-colors',
                            )}
                        >
                            <User size={14} strokeWidth={2.5} />
                        </motion.button>
                    )}
                    <motion.button
                        type="button"
                        onClick={onLogout}
                        aria-label={t('header.logout')}
                        title={t('header.logout')}
                        whileTap={{ scale: 0.92 }}
                        whileHover={{ y: -1, scale: 1.03 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                        className={cn(
                            'flex items-center justify-center',
                            'bg-white/15 text-white border border-white/20 rounded',
                            'w-7 h-7 sm:w-8 sm:h-8',
                            'shadow-[0_1px_6px_rgba(0,0,0,0.15)]',
                            'hover:bg-white/25',
                            'transition-colors',
                        )}
                    >
                        <LogOut size={12} strokeWidth={2.5} />
                    </motion.button>
                </div>
            </div>
        </header>
    );
}
