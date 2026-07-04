/**
 * Toast – shared bottom-centered notification.
 * Variants: default | info | success | warning | error.
 */
import { AnimatePresence } from 'framer-motion';
import { motion } from 'motion/react';
import { cn } from '@/shared/lib/cn';
import type { ToastMessage } from '@/shared/model/toast';

interface ToastProps {
    toasts: ToastMessage[];
}

const VARIANT_CLASSES: Record<ToastMessage['variant'], string> = {
    default: 'bg-gray-900/95',
    info: 'bg-blue-700/95',
    success: 'bg-emerald-700/95',
    warning: 'bg-orange-600/95',
    error: 'bg-red-700/95',
};

export function Toast({ toasts }: ToastProps) {
    return (
        <div
            className={cn(
                'pointer-events-none fixed inset-x-0 z-[999]',
                'bottom-[calc(env(safe-area-inset-bottom,0px)+20px)]',
                'flex flex-col items-center gap-2 px-4',
            )}
        >
            <AnimatePresence initial={false}>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                        className={cn(
                            'rounded-2xl px-5 py-2.5 text-white',
                            'text-[13px] sm:text-[14px] font-semibold text-center',
                            'max-w-[calc(100vw-40px)]',
                            'shadow-[0_8px_24px_rgba(0,0,0,0.25)]',
                            'backdrop-blur-md',
                            VARIANT_CLASSES[t.variant],
                        )}
                    >
                        {t.text}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
