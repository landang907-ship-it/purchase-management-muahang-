/**
 * FormField – SAP-style label-bar + input box (primary | secondary variants).
 */
import { useId } from 'react';
import { cn } from '@/shared/lib/cn';

type Variant = 'primary' | 'secondary';

interface FormFieldProps {
    label: string;
    subLabel?: string;
    value: string;
    onChange: (next: string) => void;
    type?: 'text' | 'password';
    variant?: Variant;
    placeholder?: string;
    autoComplete?: string;
    inputMode?: 'text' | 'numeric' | 'email';
    maxLength?: number;
    autoCapitalize?: 'off' | 'characters' | 'on' | 'words' | 'sentences';
    autoCorrect?: 'off' | 'on';
    spellCheck?: boolean;
    error?: string;
    hint?: string;
    required?: boolean;
    ariaDescribedBy?: string;
}

export function FormField({
    label,
    subLabel,
    value,
    onChange,
    type = 'text',
    variant = 'secondary',
    placeholder = ' ',
    autoComplete,
    inputMode,
    maxLength,
    autoCapitalize = 'off',
    autoCorrect = 'off',
    spellCheck = false,
    error,
    hint,
    required,
    ariaDescribedBy,
}: FormFieldProps) {
    const id = useId();
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const describedBy =
        [error ? errorId : null, hint ? hintId : null, ariaDescribedBy ?? null]
            .filter(Boolean)
            .join(' ') || undefined;

    const isPrimary = variant === 'primary';

    return (
        <div className={cn('relative flex flex-col', error && 'has-error')}>
            <label
                htmlFor={id}
                className={cn(
                    'block w-full cursor-text select-none',
                    'rounded-t-[4px] px-2 py-1',
                    'text-[13px] sm:text-[14px] leading-[1.3]',
                    isPrimary
                        ? 'bg-[color:var(--color-sap-primary)] font-bold tracking-[0.02em] text-white'
                        : 'bg-[color:var(--color-sap-primary-light)] font-semibold text-[color:var(--color-text)]',
                )}
            >
                {label}
                {subLabel ? <span className="ml-1 opacity-70">({subLabel})</span> : null}
                {required ? <span aria-hidden>&nbsp;*</span> : null}
            </label>

            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoComplete={autoComplete}
                inputMode={inputMode}
                maxLength={maxLength}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                spellCheck={spellCheck}
                required={required}
                aria-invalid={!!error}
                aria-describedby={describedBy}
                className={cn(
                    'block w-full min-h-[44px] px-3 py-2.5',
                    'text-[15px] sm:text-[16px] leading-[1.3]',
                    'rounded-b-[4px] border-0 outline-none',
                    'transition-[box-shadow,background] duration-150 ease-out',
                    isPrimary
                        ? 'bg-[color:var(--color-sap-primary)] text-white placeholder:text-white/55 focus:shadow-[inset_0_0_0_2px_rgba(255,255,255,0.7),0_0_0_3px_rgba(255,255,255,0.25)]'
                        : 'bg-[color:var(--color-sap-primary-light)] text-[color:var(--color-text)] placeholder:text-[color:var(--color-text)]/35 focus:shadow-[inset_0_0_0_2px_var(--color-sap-primary-dark),0_0_0_3px_rgba(31,111,235,0.18)]',
                    error &&
                    'shadow-[inset_0_0_0_2px_var(--color-error)] focus:shadow-[inset_0_0_0_2px_var(--color-error),0_0_0_3px_rgba(220,38,38,0.18)]',
                )}
            />

            {hint && !error ? (
                <small
                    id={hintId}
                    className="mt-[-2px] block rounded-b-[4px] bg-[color:var(--color-sap-primary-lighter)] px-2 py-0.5 text-[11px] text-[color:var(--color-text-muted)]"
                >
                    {hint}
                </small>
            ) : null}

            {error ? (
                <span
                    id={errorId}
                    role="alert"
                    className="mt-[-2px] block rounded-b-[4px] bg-[color:var(--color-error-bg)] px-2 py-0.5 text-[11px] text-[color:var(--color-error)]"
                >
                    {error}
                </span>
            ) : null}
        </div>
    );
}
