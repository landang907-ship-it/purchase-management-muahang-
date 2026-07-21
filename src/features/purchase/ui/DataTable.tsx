/**
 * DataTable – scrollable table of purchase rows with status badge column.
 */
import { cn } from '@/shared/lib/cn';
import { COL_MAP, type PurchaseRow } from '@/features/purchase/services/excel';
import { BADGE_CLASSES, statusVariant } from '@/features/purchase/services/status';
import { formatStatusText } from '@/features/purchase/lib/status';
import { useTranslation } from '@/i18n/useTranslation';

interface DataTableProps {
    rows: PurchaseRow[];
}

const COL_WIDTHS = [
    'min-w-[80px] text-center', // Yc.m.hàng
    'min-w-[70px] text-center', // Vật tư
    'min-w-[140px]', // Văn bản ngắn
    'min-w-[80px] text-center', // Ng.yêu cầu
    'min-w-[60px] text-right', // Số lượng
    'min-w-[80px] text-center', // Ngày YC
    'min-w-[90px] text-center', // T.trg xử lý
];

export function DataTable({ rows }: DataTableProps) {
    const { t } = useTranslation();

    return (
        <div
            className={cn(
                'scrollbar-thin flex-1 overflow-auto',
                '-webkit-overflow-scrolling-touch',
                'relative',
            )}
            style={{
                backgroundImage: 'linear-gradient(rgba(240, 240, 240, 0.75), rgba(240, 240, 240, 0.75)), url(/login-bg.webp)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
            }}
        >
            <table className="w-full border-collapse text-[12px] sm:text-[13px] min-w-[560px]">
                <thead className="sticky top-0 z-10">
                    <tr>
                        {COL_MAP.map((col) => (
                            <th
                                key={col.label}
                                className={cn(
                                    'bg-blue-dark text-white font-bold text-[11px]',
                                    'text-center px-1.5 py-2',
                                    'border-r border-white/15 last:border-r-0',
                                    'whitespace-nowrap tracking-wide',
                                )}
                            >
                                {t(`col.${col.label}`)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr
                            key={`${row['Yc.m.hàng']}-${idx}`}
                            className={cn(
                                'active:bg-[#c5d5f0]/80 transition-colors',
                                idx % 2 === 0 ? 'bg-white/60' : 'bg-[#e8f0fe]/60',
                            )}
                        >
                            {COL_MAP.map((col, i) => {
                                const raw = (row as unknown as Record<string, string>)[col.label] ?? '';
                                if (col.label === 'T.trg xử lý') {
                                    const variant = statusVariant(raw);
                                    return (
                                        <td
                                            key={col.label}
                                            className={cn(
                                                'px-1.5 py-2 border-b border-border',
                                                'border-r border-border last:border-r-0',
                                                'align-middle',
                                                COL_WIDTHS[i],
                                            )}
                                        >
                                            {raw ? (
                                                <span
                                                    className={cn(
                                                        'inline-block rounded-[10px] px-2 py-0.5',
                                                        'text-[10px] font-bold whitespace-nowrap text-white shadow-sm',
                                                        statusVariant(raw)
                                                    )}
                                                >
                                                    {formatStatusText(raw)}
                                                </span>
                                            ) : (
                                                <span className="text-neutral-400">–</span>
                                            )}
                                        </td>
                                    );
                                }
                                return (
                                    <td
                                        key={col.label}
                                        className={cn(
                                            'px-1.5 py-2 border-b border-border',
                                            'border-r border-border last:border-r-0',
                                            'align-middle text-text-dark leading-snug',
                                            COL_WIDTHS[i],
                                        )}
                                    >
                                        {raw || <span className="text-neutral-400">–</span>}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
