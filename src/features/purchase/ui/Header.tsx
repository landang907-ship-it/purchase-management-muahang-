/**
 * Header – fixed top bar with title, import button, and logout.
 */
import { motion } from 'motion/react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';

interface HeaderProps {
    userLabel?: string;
}

export function Header({ userLabel }: HeaderProps) {
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
            </div>
        </header>
    );
}
