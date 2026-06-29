/**
 * SiteHeader – Want Want Việt Nam title + Vietnamese date.
 */
import { useEffect, useState } from 'react';
import { renderVietnameseDate } from '@/features/purchase/lib/date';

export function SiteHeader() {
    const [dateText, setDateText] = useState(() => renderVietnameseDate());

    useEffect(() => {
        const id = window.setInterval(() => {
            setDateText(renderVietnameseDate());
        }, 60_000);
        return () => window.clearInterval(id);
    }, []);

    return (
        <header className="anim-fade-up pt-1 pb-4 text-center">
            <h1 className="mb-1 text-[18px] sm:text-[22px] font-bold tracking-tight text-white drop-shadow-sm">
                Want Want Việt Nam
                <span className="block text-[12px] sm:text-[14px] font-normal opacity-80">旺旺集团越南</span>
            </h1>
            <p
                className="text-[12px] sm:text-[13px] font-medium text-white/80 tabular-nums"
                aria-live="polite"
            >
                {dateText}
            </p>
        </header>
    );
}
