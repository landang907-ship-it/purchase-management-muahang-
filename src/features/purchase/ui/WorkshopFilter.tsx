/**
 * WorkshopFilter – multi-select dropdown để lọc theo Phân Xưởng.
 * Tương tự RequesterFilter nhưng dùng cho Phân Xưởng.
 */
import { ChevronDown, Factory, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from '@/i18n/useTranslation';

interface WorkshopFilterProps {
    options: string[];
    value: string[];
    onChange: (next: string[]) => void;
    disabled?: boolean;
}

export function WorkshopFilter({ options, value, onChange, disabled }: WorkshopFilterProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const labelId = useId();

    const selected = useMemo(() => new Set(value), [value]);
    const isActive = value.length > 0;
    const isAllSelected = value.length === options.length && options.length > 0;

    const filteredOptions = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return options;
        return options.filter((o) => o.toLowerCase().includes(q));
    }, [options, search]);

    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    };

    const handleToggle = () => {
        if (disabled) return;
        if (open) {
            setOpen(false);
        } else {
            updatePosition();
            setOpen(true);
        }
    };

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent | TouchEvent) => {
            const target = e.target as Node | null;
            if (target) {
                const insideContainer = containerRef.current?.contains(target);
                const insideDropdown = dropdownRef.current?.contains(target);
                if (!insideContainer && !insideDropdown) {
                    setOpen(false);
                }
            }
        };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('touchstart', onDown);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('touchstart', onDown);
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handleUpdate = () => updatePosition();
        window.addEventListener('scroll', handleUpdate, true);
        window.addEventListener('resize', handleUpdate);
        return () => {
            window.removeEventListener('scroll', handleUpdate, true);
            window.removeEventListener('resize', handleUpdate);
        };
    }, [open]);

    useEffect(() => {
        if (open) {
            setSearch('');
            window.setTimeout(() => searchInputRef.current?.focus(), 30);
        }
    }, [open]);

    useEffect(() => {
        if (value.length === 0) return;
        const valid = value.filter((v) => options.includes(v));
        if (valid.length !== value.length) onChange(valid);
    }, [options, value, onChange]);

    const toggle = (opt: string) => {
        const next = new Set(selected);
        if (next.has(opt)) next.delete(opt);
        else next.add(opt);
        onChange(Array.from(next));
    };

    const selectAll = () => onChange([...options]);
    const clearAll = () => onChange([]);

    const triggerLabel = isActive
        ? value.length === 1
            ? value[0]
            : t('filter.selected') + ` ${value.length}`
        : t('filter.allCount') + ` (${options.length})`;

    const dropdownContent = (
        <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            aria-multiselectable="true"
            aria-labelledby={labelId}
            style={{
                position: 'fixed',
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
            }}
            className={cn(
                'z-[9999]',
                'bg-white border border-border rounded-lg shadow-xl',
                'overflow-hidden min-w-[240px] max-w-[90vw]',
                'flex flex-col max-h-[60vh]',
            )}
        >
            <div className="flex items-center gap-1.5 px-2 py-2 border-b border-border bg-white shrink-0">
                <Search size={14} strokeWidth={2.5} className="shrink-0 text-blue-mid" />
                <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('filter.search')}
                    aria-label={t('filter.searchAria')}
                    className={cn(
                        'flex-1 min-w-0',
                        'bg-transparent border-0 outline-none',
                        'text-[12px] sm:text-[13px] text-text-dark',
                        'placeholder:text-neutral-400',
                    )}
                />
                {search ? (
                    <button
                        type="button"
                        onClick={() => setSearch('')}
                        aria-label={t('filter.clearSearch')}
                        className="shrink-0 text-neutral-400 hover:text-text-dark"
                    >
                        <X size={13} strokeWidth={2.5} />
                    </button>
                ) : null}
            </div>

            <div className="flex items-center gap-2 shrink-0 px-2 py-1.5 border-b border-border bg-row-even text-[11px] font-semibold">
                <span className="text-text-dark">
                    {isActive
                        ? t('filter.selectedOf', { selected: String(value.length), total: String(options.length) })
                        : t('filter.workshops', { count: options.length })}
                </span>
                <div className="ml-auto flex items-center gap-1">
                    <button
                        type="button"
                        onClick={selectAll}
                        disabled={isAllSelected}
                        className={cn(
                            'px-2 py-0.5 rounded',
                            'bg-white border border-border text-text-dark',
                            'disabled:opacity-40 disabled:cursor-not-allowed',
                            'hover:bg-row-odd transition-colors',
                        )}
                    >
                        {t('filter.selectAll')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className={cn(
                            'px-2 py-0.5 rounded',
                            'bg-blue-mid text-white',
                            'hover:brightness-110 transition-[filter]',
                        )}
                    >
                        {t('filter.confirm')}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
                {filteredOptions.length === 0 ? (
                    <p className="px-3 py-3 text-center text-[12px] text-neutral-500">
                        {t('filter.noResults')}
                    </p>
                ) : (
                    filteredOptions.map((opt) => {
                        const isSelected = selected.has(opt);
                        return (
                            <button
                                key={opt}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => toggle(opt)}
                                className={cn(
                                    'w-full flex items-center gap-2 text-left',
                                    'px-3 py-1.5',
                                    'text-[12px] sm:text-[13px]',
                                    'border-b border-border/50 last:border-b-0',
                                    'transition-colors',
                                    isSelected
                                        ? 'bg-blue-mid/15 text-text-dark font-semibold'
                                        : 'bg-white text-text-dark hover:bg-row-even active:bg-row-even',
                                )}
                            >
                                <span
                                    className={cn(
                                        'shrink-0 flex items-center justify-center',
                                        'w-4 h-4 rounded border-2',
                                        isSelected
                                            ? 'bg-blue-mid border-blue-mid text-white'
                                            : 'border-neutral-400 bg-white',
                                    )}
                                    aria-hidden
                                >
                                    {isSelected ? '✓' : ''}
                                </span>
                                <span className="truncate flex-1">{opt}</span>
                            </button>
                        );
                    })
                )}
            </div>

            <div className="flex items-center justify-end shrink-0 px-2 py-1.5 border-t border-border bg-row-even">
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className={cn(
                        'px-3 py-1 rounded',
                        'bg-red text-white text-[12px] font-semibold',
                        'hover:brightness-110 transition-[filter]',
                    )}
                >
                    {t('filter.close')}
                </button>
            </div>
        </motion.div>
    );

    return (
        <>
            <div
                ref={containerRef}
                className={cn(
                    'relative shrink-0',
                    'bg-white border-b border-border',
                )}
            >
                <div className="flex items-center gap-1 px-1.5 py-0.5 min-h-[26px]">
                    <label
                        id={labelId}
                        className={cn(
                            'flex items-center gap-1 shrink-0',
                            'text-[10px] sm:text-[11px] font-semibold',
                            'text-text-dark whitespace-nowrap',
                        )}
                    >
                        <Factory size={13} strokeWidth={2.5} className="text-blue-mid" />
                        {t('filter.workshop')}
                    </label>

                    <motion.button
                        ref={triggerRef}
                        type="button"
                        aria-labelledby={labelId}
                        aria-haspopup="listbox"
                        aria-expanded={open}
                        disabled={disabled}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleToggle}
                        className={cn(
                            'flex-1 min-w-0',
                            'flex items-center justify-between gap-1',
                            'bg-row-even border border-border rounded',
                            'px-1 py-0.5 text-[10px] sm:text-[11px]',
                            'text-text-dark text-left',
                            'focus:outline-none focus:ring-1 focus:ring-blue-mid/40 focus:border-blue-mid',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'transition-shadow',
                            isActive && 'border-blue-mid bg-blue-mid/10 font-semibold',
                        )}
                    >
                        <span className="truncate">{triggerLabel}</span>
                        <ChevronDown
                            size={10}
                            strokeWidth={2.5}
                            className={cn(
                                'shrink-0 text-blue-mid transition-transform',
                                open && 'rotate-180',
                            )}
                        />
                    </motion.button>

                    {isActive ? (
                        <motion.button
                            type="button"
                            aria-label={t('filter.clear')}
                            title={t('filter.clear')}
                            whileTap={{ scale: 0.92 }}
                            onClick={clearAll}
                            className={cn(
                                'shrink-0 flex items-center justify-center',
                                'w-5 h-5 rounded-full',
                                'bg-red text-white shadow-sm',
                                'hover:brightness-110 transition-[filter]',
                            )}
                        >
                            <X size={9} strokeWidth={2.5} />
                        </motion.button>
                    ) : (
                        <div className="w-5 h-5 shrink-0" aria-hidden />
                    )}
                </div>
            </div>

            {open && createPortal(dropdownContent, document.body)}
        </>
    );
}
