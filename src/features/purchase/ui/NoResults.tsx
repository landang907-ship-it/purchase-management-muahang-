/**
 * NoResults – shown when current tab has zero rows after filtering.
 */
import { motion } from 'motion/react';
import { SearchX } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';

interface NoResultsProps {
    message: string;
}

export function NoResults({ message: _message }: NoResultsProps) {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={cn(
                'h-full w-full flex flex-col items-center justify-center',
                'px-8 py-8 text-center gap-2 text-neutral-500',
            )}
            style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(/login-bg.webp)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
            }}
        >
            <SearchX size={40} strokeWidth={1.5} className="text-neutral-400" />
            <p className="text-[14px] font-medium">{t('noresults.tab')}</p>
        </motion.div>
    );
}
