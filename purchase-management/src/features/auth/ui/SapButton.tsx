/**
 * SapButton – 3D glossy button with Indian tricolor stripes (SAP style).
 */
import { motion } from 'motion/react';
import { cn } from '@/shared/lib/cn';

interface SapButtonProps {
    label: string;
    subLabel?: string;
    loadingLabel?: string;
    isLoading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit';
    ariaLabel?: string;
}

export function SapButton({
    label,
    subLabel,
    loadingLabel = 'Đang xử lý…',
    isLoading = false,
    disabled = false,
    onClick,
    type = 'submit',
    ariaLabel,
}: SapButtonProps) {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            aria-label={ariaLabel || label}
            aria-busy={isLoading}
            whileTap={isLoading ? undefined : { scale: 0.985, y: 1 }}
            whileHover={isLoading ? undefined : { y: -2, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            className={cn(
                'group relative block w-full select-none',
                'min-h-[84px] sm:min-h-[96px] px-6 py-5',
                'rounded-xl overflow-hidden',
                'shadow-[0_10px_30px_-8px_rgba(0,0,0,0.25),0_4px_10px_-4px_rgba(0,0,0,0.15)]',
                'hover:shadow-[0_16px_35px_-10px_rgba(0,0,0,0.3),0_6px_14px_-4px_rgba(0,0,0,0.2)]',
                'active:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.08)]',
                'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-orange-400',
                'disabled:cursor-not-allowed disabled:opacity-80',
                'transition-[box-shadow] duration-200 ease-out',
            )}
        >
            {/* Glossy overlay */}
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/30 via-white/10 to-transparent"
            />

            {/* Tricolor stripes (Indian flag) */}
            <div className="absolute inset-0 flex flex-col">
                {/* Saffron (orange) - top */}
                <div className="h-1/3 bg-gradient-to-b from-[#FF9933] to-[#FF6B35]" />
                {/* White - middle */}
                <div className="h-1/3 bg-white" />
                {/* Green - bottom */}
                <div className="h-1/3 bg-gradient-to-b from-[#138808] to-[#0F6B06]" />
            </div>

            {/* 3D glass effect overlay */}
            <span
                aria-hidden
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 via-transparent to-black/10"
            />

            {/* Inner shadow for depth */}
            <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-xl bg-gradient-to-t from-black/20 to-transparent"
            />

            {/* Text */}
            <span
                className={cn(
                    'relative z-[2] inline-block font-bold uppercase tracking-wider',
                    'text-[13px] sm:text-[14px]',
                    isLoading && 'opacity-85',
                )}
            >
                {isLoading ? loadingLabel : label}
                {subLabel ? <span className="block text-[10px] sm:text-[11px] normal-case tracking-normal opacity-80">{subLabel}</span> : null}
            </span>

            {/* Loading spinner */}
            <span
                aria-hidden
                className={cn(
                    'absolute right-[18px] top-1/2 -mt-[9px]',
                    'h-[18px] w-[18px] rounded-full',
                    'border-2 border-white/60 border-t-white',
                    'transition-[opacity,transform] duration-150',
                    isLoading
                        ? 'scale-100 opacity-100 animate-spin-slow'
                        : 'scale-50 opacity-0',
                )}
            />
        </motion.button>
    );
}
