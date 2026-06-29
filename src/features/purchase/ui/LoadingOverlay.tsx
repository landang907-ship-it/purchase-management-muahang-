/**
 * LoadingOverlay – spinner shown while parsing the Excel file.
 */
import { motion } from 'motion/react';
import { cn } from '@/shared/lib/cn';

export function LoadingOverlay() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
                'absolute inset-0 z-30',
                'bg-[rgba(244,247,255,0.92)]',
                'flex flex-col items-center justify-center gap-3.5',
                'text-[13px] text-blue-dark font-semibold',
            )}
        >
            <div
                className={cn(
                    'h-10 w-10 rounded-full',
                    'border-4 border-border',
                    'border-t-blue-mid',
                    'animate-spin',
                )}
                style={{ animationDuration: '0.8s' }}
            />
            <span>Đang đọc file…</span>
        </motion.div>
    );
}
