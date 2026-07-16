/**
 * NoResults – shown when current tab has zero rows after filtering.
 */
import { motion } from 'motion/react';
import { SearchX } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface NoResultsProps {
    message: string;
}

export function NoResults({ message }: NoResultsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={cn(
                'flex-1 flex flex-col items-center justify-center',
                'px-8 py-8 text-center gap-3 text-slate-800 drop-shadow-sm',
            )}
            style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(/login-bg.webp)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
            }}
        >
            <SearchX size={48} strokeWidth={1.5} className="text-slate-700 drop-shadow-sm" />
            <p className="text-[15px] font-semibold max-w-xs leading-relaxed">{message}</p>
        </motion.div>
    );
}
