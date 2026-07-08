/**
 * EmptyState – shown when no file has been imported yet.
 */
import { motion } from 'motion/react';
import { FileSpreadsheet, Upload } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';

interface EmptyStateProps {
    onImport: () => void;
}

export function EmptyState({ onImport }: EmptyStateProps) {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                'flex-1 flex flex-col items-center justify-center',
                'px-6 py-8 text-center gap-2.5',
            )}
        >
            <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                className="text-blue-mid"
            >
                <FileSpreadsheet size={52} strokeWidth={1.4} />
            </motion.div>
            <h2 className="text-[16px] font-bold text-blue-dark">{t('empty.title')}</h2>
            <p className="text-[13px] text-text-mid leading-relaxed max-w-[300px]">
                {t('empty.hint')}
            </p>
            <motion.button
                type="button"
                onClick={onImport}
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                className={cn(
                    'mt-3 flex items-center gap-2',
                    'bg-red text-white border-0 rounded-lg',
                    'px-5 py-2.5 text-[13px] font-semibold',
                    'shadow-[0_4px_14px_rgba(239,68,68,0.4)]',
                    'hover:shadow-[0_10px_24px_rgba(239,68,68,0.55)]',
                    'hover:brightness-110 transition-[filter]',
                )}
            >
                <Upload size={16} />
                {t('empty.button')}
            </motion.button>
            <p className="text-[12px] text-neutral-500 bg-row-even rounded-md px-3 py-2 mt-2 leading-relaxed max-w-[320px]">
                {t('empty.note')}
            </p>
        </motion.div>
    );
}
