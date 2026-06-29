/**
 * Status bar – shows current file and total record count.
 */
import { cn } from '@/shared/lib/cn';

interface StatusBarProps {
    fileName: string;
    count: number;
}

export function StatusBar({ fileName, count }: StatusBarProps) {
    return (
        <div
            className={cn(
                'flex shrink-0 items-center justify-between gap-2',
                'bg-blue-dark text-white',
                'px-2 py-1 text-[10px] font-medium',
                'min-h-[28px]',
            )}
        >
            <span className="truncate">
                {fileName ? `📄 ${fileName}` : 'Chưa có file – Hãy nhấn NHẬP'}
            </span>
            <span
                className={cn(
                    'shrink-0 rounded-full bg-red text-white',
                    'px-1.5 py-0.5 text-[10px] font-bold',
                )}
            >
                {count} bản ghi
            </span>
        </div>
    );
}
